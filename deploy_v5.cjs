const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const host = '185.233.164.251';
const username = 'root';
const password = 'UIosWlgL1uW1kJ';
const zipName = 'keepcode_deploy_5.zip';
const localZipPath = path.join(__dirname, zipName);
const remoteZipPath = `/root/${zipName}`;
const deployDir = '/root/bot/keepcode';

console.log("=== 1. YEREL DERLEME & ZIP HAZIRLIĞI ===");

try {
    // A. Frontend build işlemini çalıştır
    console.log("React Frontend derleniyor (npm run build)...");
    execSync('npm run build', { cwd: path.join(__dirname, 'keepcodeai-frontend'), stdio: 'inherit' });
    console.log("Frontend başarıyla derlendi.");

    // B. Derlenen public statik dosyalarını backend public/ dizinine kopyala
    const frontendDist = path.join(__dirname, 'keepcodeai-frontend', 'dist');
    const backendPublic = path.join(__dirname, 'keepcodeai-backend', 'public');

    console.log("Frontend build dosyaları backend public dizinine taşınıyor...");
    if (fs.existsSync(backendPublic)) {
        fs.rmSync(backendPublic, { recursive: true, force: true });
    }
    fs.mkdirSync(backendPublic, { recursive: true });

    // Node.js ile dizin kopyalama yardımcısı
    function copyFolderRecursiveSync(source, target) {
        let files = [];
        const targetFolder = path.join(target, path.basename(source));
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach(function (file) {
                const curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    copyFolderRecursiveSync(curSource, targetFolder);
                } else {
                    fs.copyFileSync(curSource, path.join(targetFolder, file));
                }
            });
        }
    }

    // dist içindeki tüm dosyaları backend/public altına kopyala
    const distFiles = fs.readdirSync(frontendDist);
    distFiles.forEach(file => {
        const srcPath = path.join(frontendDist, file);
        const destPath = path.join(backendPublic, file);
        if (fs.lstatSync(srcPath).isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyFolderRecursiveSync(srcPath, backendPublic);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
    console.log("Kopyalama tamamlandı.");

    // C. Eski geçici zip varsa sil ve yenisini oluştur
    if (fs.existsSync(localZipPath)) {
        fs.unlinkSync(localZipPath);
    }
    
    // PowerShell ile backend dizinini (artık derlenmiş frontend'i de içeriyor) sıkıştır
    const cmd = `powershell -Command "Compress-Archive -Path 'keepcodeai-backend/index.js', 'keepcodeai-backend/package.json', 'keepcodeai-backend/.env', 'keepcodeai-backend/public' -DestinationPath '${zipName}' -Force"`;
    console.log("Zipleme komutu çalıştırılıyor:", cmd);
    execSync(cmd, { stdio: 'inherit' });
    console.log("Paketleme başarıyla tamamlandı:", zipName);
} catch (err) {
    console.error("Yerel derleme/zipleme hatası:", err);
    process.exit(1);
}

console.log(`\n=== 2. SSH SUNUCU BAĞLANTISI (${host}) ===`);
const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Bağlantısı başarılı!');
    
    conn.sftp((err, sftp) => {
        if (err) {
            console.error('SFTP hatası:', err);
            conn.end();
            process.exit(1);
        }
        
        console.log(`\n=== 3. DOSYA YÜKLEME (SFTP) ===`);
        console.log(`Yükleniyor: ${remoteZipPath}...`);
        
        sftp.fastPut(localZipPath, remoteZipPath, {}, (uploadErr) => {
            if (uploadErr) {
                console.error('Yükleme hatası:', uploadErr);
                conn.end();
                process.exit(1);
            }
            
            console.log('Yükleme tamamlandı.');
            console.log(`\n=== 4. SUNUCU DEPLOY & NGINX GÜNCELLEME ===`);

            // Sunucuda çalışacak komutlar listesi
            const sshCommands = [
                // Klasörleri hazırla ve zip'i aç
                `mkdir -p ${deployDir}`,
                `unzip -o ${remoteZipPath} -d ${deployDir} || true`,
                `cd ${deployDir}`,
                
                // npm bağımlılıklarını kur
                `npm install --production`,
                
                // PM2 servisini yönet
                `if command -v pm2 >/dev/null 2>&1; then pm2 delete keepcodeai-backend || true; pm2 start index.js --name keepcodeai-backend; else nohup node index.js > output.log 2>&1 & fi`,
                
                // Nginx konfigürasyonunu sunucuya yükle ve servisi reload et
                // nginx-keepcode.conf dosyasını deploy dizininden nginx klasörüne kopyala
                `if [ -f ${deployDir}/nginx-keepcode.conf ]; then cp ${deployDir}/nginx-keepcode.conf /etc/nginx/sites-available/keepcodeai.conf; ln -sf /etc/nginx/sites-available/keepcodeai.conf /etc/nginx/sites-enabled/ || true; nginx -t && systemctl reload nginx || true; fi`,
                
                // Temizlik
                `rm -f ${remoteZipPath}`
            ].join(' && ');

            // Nginx config'i de zip dosyasına dahil etmek için nginx-keepcode.conf kopyalıyoruz
            // Ancak zipleme bittiği için doğrudan SFTP ile nginx-keepcode.conf dosyasını da yollayalım
            console.log("Nginx konfigürasyon dosyası sunucuya kopyalanıyor...");
            sftp.fastPut(path.join(__dirname, 'nginx-keepcode.conf'), `${deployDir}/nginx-keepcode.conf`, {}, (nginxErr) => {
                if (nginxErr) {
                    console.warn('Nginx dosyası yüklenemedi (Manuel kopyalanması gerekebilir):', nginxErr);
                }

                console.log("Uzak sunucuda kurulum komutları çalıştırılıyor...");
                conn.exec(sshCommands, (execErr, stream) => {
                    if (execErr) {
                        console.error('Komut çalıştırma hatası:', execErr);
                        conn.end();
                        process.exit(1);
                    }
                    
                    stream.on('close', (code, signal) => {
                        console.log(`Uzaktaki işlemler tamamlandı. Çıkış Kodu: ${code}`);
                        conn.end();
                        
                        // Yerel geçici dosyayı temizle
                        if (fs.existsSync(localZipPath)) {
                            fs.unlinkSync(localZipPath);
                        }
                        console.log('\n==================================================');
                        console.log('🎉 KeepCode AI Deploy İşlemi Başarıyla Tamamlandı!');
                        console.log('==================================================');
                    }).on('data', (data) => {
                        console.log('STDOUT: ' + data);
                    }).stderr.on('data', (data) => {
                        console.log('STDERR: ' + data);
                    });
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('SSH Bağlantı Hatası:', err);
}).connect({
    host: host,
    port: 22,
    username: username,
    password: password
});
