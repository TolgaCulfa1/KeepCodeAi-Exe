const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SSH_HOST = '191.44.89.41';
const SSH_PASS = '3ct_RD!Ver';
const REMOTE_PATH = '/var/www/keepcodeai/public/downloads/KeepCodeAIUserSetup-x64.exe';
const REMOTE_SERVER_JS = '/var/www/keepcodeai/src/server.js';

// Paths
const productJsonPath = path.join(__dirname, 'product.json');

function generateRandomCommit() {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 40; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// Runs scp/ssh with automatic interactive password input on Windows without pipe deadlocks
function runSecureCommand(cmd, args, password) {
    const escapedArgs = args.replace(/'/g, "''");
    const escapedPass = password.replace(/'/g, "''");
    
    // We set RedirectStandardOutput/Error to $false to avoid pipe deadlocks when transferring large files!
    const psScript = `
        $psi = New-Object System.Diagnostics.ProcessStartInfo;
        $psi.FileName = '${cmd}';
        $psi.Arguments = '${escapedArgs}';
        $psi.RedirectStandardInput = $true;
        $psi.RedirectStandardOutput = $false;
        $psi.RedirectStandardError = $false;
        $psi.UseShellExecute = $false;
        $p = [System.Diagnostics.Process]::Start($psi);
        $p.StandardInput.WriteLine('${escapedPass}');
        $p.StandardInput.Close();
        $p.WaitForExit();
        if ($p.ExitCode -ne 0) {
            throw "Process exited with non-zero code $($p.ExitCode)";
        }
    `.trim().replace(/\s+/g, ' ');

    try {
        execSync(`powershell -NoProfile -NonInteractive -Command "${psScript.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    } catch (err) {
        throw new Error(`Command [${cmd} ${args}] failed.`);
    }
}

console.log('==================================================');
console.log('🚀 KeepCode AI - Otomatik Derleme & Güncelleme Scripti');
console.log('==================================================\n');

try {
    // 1. Yeni Commit Hash Üret
    const newCommit = generateRandomCommit();
    console.log(`📌 1. Yeni Güncelleme Hash'i üretildi: ${newCommit}`);

    // 2. product.json Güncelle
    console.log('📝 2. product.json güncelleniyor...');
    const productJson = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
    const oldCommit = productJson.commit;
    productJson.commit = newCommit;
    fs.writeFileSync(productJsonPath, JSON.stringify(productJson, null, '\t'), 'utf8');
    console.log(`   ✓ product.json güncellendi! (${oldCommit} -> ${newCommit})`);

    // 3. Derlenen .exe Dosyasını Bul
    let localExePath = path.join(__dirname, 'KeepCodeAIUserSetup-x64.exe');
    if (!fs.existsSync(localExePath)) {
        const altPaths = [
            path.join(__dirname, '../KeepCodeAIUserSetup-x64.exe'),
            path.join(__dirname, 'build/win32/Output/KeepCodeAIUserSetup-x64.exe'),
            path.join(__dirname, '../VSCode-win32-x64/setup/KeepCodeAIUserSetup-x64.exe'),
            path.join(__dirname, 'out/KeepCodeAIUserSetup-x64.exe')
        ];
        for (const p of altPaths) {
            if (fs.existsSync(p)) {
                localExePath = p;
                break;
            }
        }
    }

    if (!fs.existsSync(localExePath)) {
        console.error(`\n❌ HATA: Derlenmiş KeepCodeAIUserSetup-x64.exe dosyası bulunamadı!`);
        console.log(`   Lütfen .exe dosyasını derleyip şu konuma koyun: ${localExePath}`);
        process.exit(1);
    }

    console.log(`\n📦 3. Derlenmiş EXE dosyası doğrulandı: ${localExePath}`);

    // 4. Sunucuya .exe Yükle (SCP)
    console.log(`\n📤 4. Yeni EXE sunucuya yükleniyor (${SSH_HOST})...`);
    console.log('      Lütfen bekleyin, dosya boyutu büyük olduğu için transfer 1-2 dakika sürebilir...');
    runSecureCommand('scp', `-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o PasswordAuthentication=yes -o PreferredAuthentications=password "${localExePath}" root@${SSH_HOST}:${REMOTE_PATH}`, SSH_PASS);
    console.log('   ✓ EXE sunucuya başarıyla yüklendi!');

    // 5. Sunucudaki server.js Dosyasını Güncelle
    console.log('\n⚙️  5. Sunucu güncelleme API configleri ayarlanıyor...');
    
    // server.js'i sunucudan indirip, içindeki LATEST_COMMIT değişkenini yeni hash ile değiştirelim
    const localServerJs = path.join(__dirname, 'server_new.js');
    runSecureCommand('scp', `-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o PasswordAuthentication=yes -o PreferredAuthentications=password root@${SSH_HOST}:${REMOTE_SERVER_JS} "${localServerJs}"`, SSH_PASS);
    
    let serverContent = fs.readFileSync(localServerJs, 'utf8');
    // LATEST_COMMIT satırını bulup değiştir
    serverContent = serverContent.replace(/const LATEST_COMMIT = '[a-f0-9]{40}';/g, `const LATEST_COMMIT = '${newCommit}';`);
    fs.writeFileSync(localServerJs, serverContent, 'utf8');

    // Güncellenmiş server.js'i geri yükle
    runSecureCommand('scp', `-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o PasswordAuthentication=yes -o PreferredAuthentications=password "${localServerJs}" root@${SSH_HOST}:${REMOTE_SERVER_JS}`, SSH_PASS);
    fs.unlinkSync(localServerJs); // temizle
    console.log(`   ✓ Sunucu güncelleme API'si güncellendi! Yeni Hash: ${newCommit}`);

    // 6. Sunucuyu Yeniden Başlat (PM2)
    console.log('\n🔄 6. Sunucu servisleri yeniden başlatılıyor...');
    runSecureCommand('ssh', `-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o PasswordAuthentication=yes -o PreferredAuthentications=password root@${SSH_HOST} pm2 restart keepcodeai`, SSH_PASS);
    console.log('   ✓ PM2 keepcodeai servisi yeniden başlatıldı!');

    console.log('\n==================================================');
    console.log('🎉 GÜNCELLEME TAMAMLANDI VE YAYINLANDI!');
    console.log('==================================================');
    console.log('   IDE kullanan tüm kullanıcıların ekranına anında');
    console.log('   "Restart to Update →" butonu gelecektir!');
    console.log('==================================================\n');

} catch (error) {
    console.error('\n❌ Güncelleme sırasında bir hata oluştu:', error.message);
    process.exit(1);
}
