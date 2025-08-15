const { execSync } = require('child_process');
const pattern = "(#[0-9a-fA-F]{3,8}|(?:rgb|hsl)a?\\(|'(?:white|black|red|blue|green|gray|grey|yellow|orange|pink)'|\"(?:white|black|red|blue|green|gray|grey|yellow|orange|pink)\")";
try {
  const cmd = `rg --no-heading -n ${JSON.stringify(pattern)} sudokuru/app | grep -v 'sudokuru/app/Styling'`;
  const result = execSync(cmd, { stdio: 'pipe', shell: '/bin/bash' }).toString();
  if (result.trim().length > 0) {
    console.error(result);
    process.exit(1);
  }
} catch (e) {
  if (e.status === 1 && (!e.stdout || e.stdout.toString().trim() === '')) {
    process.exit(0);
  }
  console.error(e.stdout?.toString() || e.message);
  process.exit(1);
}
