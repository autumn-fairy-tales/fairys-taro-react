import fs from 'fs';
import path from 'path';

const run = async () => {
  try {
    const im = await import('../esm/colors.js');
    const { colorVars } = im;
    const css = Object.entries(colorVars)
      .map(([key, value]) => {
        return `${key}: ${value};`;
      })
      .join('\n');
    fs.writeFileSync(path.join(process.cwd(), 'assets/colors.var.css'), `:root, :host, page {\n${css}\n}`, {
      encoding: 'utf-8',
      flag: 'w+',
    });
  } catch (error) {
    console.error(error);
  }
};
run();
