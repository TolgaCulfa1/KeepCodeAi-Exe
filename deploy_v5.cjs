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

console.log("1. Yerelde frontend ve backend klasörleri ziplemeye hazırlanıyor...");

// PowerShell ile node_modules hariç backend dosyalarını ziple
try {
    if (fs.existsSync(localZipPath)) {
        fs.unlinkSync(localZipPath);
    }
    
    // Yalnızca gerekli dosyaları sıkıştır
    const cmd = `powershell -Command "Compress-Archive -Path 'keepcodeai-backend/index.js', 'keepcodeai-backend/package.json', 'keepcodeai-backend/.env', 'keepcodeai-backend/public' -DestinationPath '${zipName}' -Force"`;
    console.log("Çalıştırılan komut:", cmd);
    execSync(cmd, { stdio: 'inherit' });
    console.log("Dosyalar başarıyla ziplendi:", zipName);
} catch (err) {
    console.error("Zipleme hatası:", err);
    process.exit(1);
}

console.log(`2. SSH ile VDS sunucusuna (${host}) bağlanılıyor...`);
const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Bağlantısı başarılı!');
    
    // SFTP ile yükleme başlat
    conn.sftp((err, sftp) => {
        if (err) {
            console.error('SFTP başlatma hatası:', err);
            conn.end();
            process.exit(1);
        }
        
        console.log(`3. Zip dosyası sunucuya yükleniyor: ${remoteZipPath}...`);
        
        sftp.fastPut(localZipPath, remoteZipPath, {}, (uploadErr) => {
            if (uploadErr) {
                console.error('SFTP yükleme hatası:', uploadErr);
                conn.end();
                process.exit(1);
            }
            
            console.log('Yükleme tamamlandı. 4. Uzak sunucu komutları çalıştırılıyor...');
            
            const sshCommands = [
                `mkdir -p ${deployDir}`,
                `unzip -o ${remoteZipPath} -d ${deployDir} || true`,
                `cd ${deployDir}`,
                `npm install --production`,
                `if command -v pm2 >/dev/null 2>&1; then pm2 delete keepcodeai-backend || true; pm2 start index.js --name keepcodeai-backend; else nohup node index.js > output.log 2>&1 & fi`,
                `rm -f ${remoteZipPath}`
            ].join(' && ');

            conn.exec(sshCommands, (execErr, stream) => {
                if (execErr) {
                    console.error('Komut çalıştırma hatası:', execErr);
                    conn.end();
                    process.exit(1);
                }
                
                stream.on('close', (code, signal) => {
                    console.log(`Uzak sunucu işlemleri tamamlandı. Çıkış Kodu: ${code}`);
                    conn.end();
                    
                    // Yerel geçici zip dosyasını temizle
                    if (fs.existsSync(localZipPath)) {
                        fs.unlinkSync(localZipPath);
                    }
                    console.log('Dağıtım (Deployment) başarıyla tamamlandı!');
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
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
