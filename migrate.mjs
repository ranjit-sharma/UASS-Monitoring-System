import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

const getFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(getFiles(file));
      }
    } else {
      results.push(file);
    }
  });
  return results;
};

// 1. Identify Backend Moves
const serverSrc = path.join(projectRoot, 'server', 'src');
const serverModules = path.join(serverSrc, 'modules');
const backendMoves = [];

if (fs.existsSync(serverModules)) {
  const moduleDirs = fs.readdirSync(serverModules);
  moduleDirs.forEach(mod => {
    const modPath = path.join(serverModules, mod);
    if (fs.statSync(modPath).isDirectory()) {
      const files = fs.readdirSync(modPath);
      files.forEach(file => {
        const filePath = path.join(modPath, file);
        if (file.endsWith('.controller.js')) {
          backendMoves.push({ from: filePath, to: path.join(serverSrc, 'controllers', file) });
        } else if (file.endsWith('.model.js')) {
          backendMoves.push({ from: filePath, to: path.join(serverSrc, 'models', file) });
        } else if (file.endsWith('.routes.js')) {
          backendMoves.push({ from: filePath, to: path.join(serverSrc, 'routes', file) });
        } else if (file.endsWith('.schema.js')) {
          backendMoves.push({ from: filePath, to: path.join(serverSrc, 'validators', file) });
        } else if (file.endsWith('.service.js')) {
          backendMoves.push({ from: filePath, to: path.join(serverSrc, 'services', file) });
        } else if (file === 'lanReceiver.js' || file === 'simulator.js') {
          backendMoves.push({ from: filePath, to: path.join(serverSrc, 'collectors', file) });
        } else if (file === 'socket.server.js') {
          backendMoves.push({ from: filePath, to: path.join(serverSrc, 'sockets', file) });
        }
      });
    }
  });
}

if (fs.existsSync(path.join(serverSrc, 'reset.js'))) {
  backendMoves.push({ from: path.join(serverSrc, 'reset.js'), to: path.join(serverSrc, 'scripts', 'reset.js') });
}

// 2. Identify Frontend Moves
const clientSrc = path.join(projectRoot, 'client', 'src');
const frontendMoves = [];
const clientFiles = getFiles(clientSrc);

clientFiles.forEach(file => {
  const relPath = path.relative(clientSrc, file).replace(/\\/g, '/');
  
  if (relPath.startsWith('models/')) {
    frontendMoves.push({ from: file, to: path.join(clientSrc, 'services', path.basename(file)) });
  } else if (relPath.startsWith('views/')) {
    frontendMoves.push({ from: file, to: path.join(clientSrc, 'pages', path.basename(file)) });
  } else if (relPath.startsWith('controllers/')) {
    frontendMoves.push({ from: file, to: path.join(clientSrc, 'hooks', path.basename(file)) });
  } else if (relPath === 'index.css') {
    frontendMoves.push({ from: file, to: path.join(clientSrc, 'styles', 'index.css') });
  }
});

// 3. Identify Root Script Moves
const rootFiles = fs.readdirSync(projectRoot);
const rootMoves = [];
rootFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.statSync(filePath).isFile() && file.endsWith('.js') && file !== 'migrate.js' && file !== 'package.json') {
    if (file.startsWith('fix') || file.startsWith('rewrite') || file === 'restore.js' || file === 'undo.js' || file === 'gen-chart.js' || file === 'test-api.js' || file === 'test-login.js' || file === 'reset.js' || file === 'rebuild-tracker.js' || file === 'remove-maps.js' || file === 'update-compass.js' || file === 'write-css.js') {
      rootMoves.push({ from: filePath, to: path.join(projectRoot, 'scripts', 'maintenance', file) });
    }
  }
});

const allMoves = [...backendMoves, ...frontendMoves, ...rootMoves];
const moveMap = new Map();
allMoves.forEach(m => moveMap.set(m.from, m.to));

allMoves.forEach(m => {
  const dir = path.dirname(m.to);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function computeNewImportPath(importPath, currentFileOrig, currentFileNew) {
  if (!importPath.startsWith('.')) return importPath;

  const currentDirOrig = path.dirname(currentFileOrig);
  let importedFileOrigAbs = path.resolve(currentDirOrig, importPath);
  
  // Try exact match, then with .js, then with .jsx
  let importedFileNewAbs = moveMap.get(importedFileOrigAbs);
  if (!importedFileNewAbs && moveMap.has(importedFileOrigAbs + '.js')) {
    importedFileNewAbs = moveMap.get(importedFileOrigAbs + '.js');
  } else if (!importedFileNewAbs && moveMap.has(importedFileOrigAbs + '.jsx')) {
    importedFileNewAbs = moveMap.get(importedFileOrigAbs + '.jsx');
  } else if (!importedFileNewAbs) {
    importedFileNewAbs = importedFileOrigAbs;
  }
  
  const currentDirNew = path.dirname(currentFileNew);
  let newRelative = path.relative(currentDirNew, importedFileNewAbs).replace(/\\/g, '/');
  
  if (!newRelative.startsWith('.')) {
    newRelative = './' + newRelative;
  }
  
  // Strip extension if it was stripped originally
  if (!importPath.endsWith('.js') && !importPath.endsWith('.jsx')) {
    if (newRelative.endsWith('.js')) newRelative = newRelative.slice(0, -3);
    else if (newRelative.endsWith('.jsx')) newRelative = newRelative.slice(0, -4);
  }

  return newRelative;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  const newFilePath = moveMap.get(filePath) || filePath;

  const importRegex = /(from\s+['"])([^'"]+)(['"])|(import\s+['"])([^'"]+)(['"])|(import\(['"])([^'"]+)(['"]\))|(require\(['"])([^'"]+)(['"]\))/g;
  
  newContent = newContent.replace(importRegex, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12) => {
    const prefix = p1 || p4 || p7 || p10;
    const importPath = p2 || p5 || p8 || p11;
    const suffix = p3 || p6 || p9 || p12;
    
    if (importPath.startsWith('.')) {
      const newImportPath = computeNewImportPath(importPath, filePath, newFilePath);
      return prefix + newImportPath + suffix;
    }
    return match;
  });

  return newContent;
}

const filesToProcess = [...getFiles(path.join(projectRoot, 'server')), ...getFiles(path.join(projectRoot, 'client'))];

// Add the root files to filesToProcess!
rootMoves.forEach(m => filesToProcess.push(m.from));

const fileContents = new Map();
filesToProcess.forEach(f => {
  if (fs.existsSync(f)) {
    if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.css') || f.endsWith('.html')) {
      fileContents.set(f, processFile(f));
    } else {
      fileContents.set(f, fs.readFileSync(f));
    }
  }
});

allMoves.forEach(m => {
  if (fs.existsSync(m.from)) {
    const content = fileContents.get(m.from);
    if (content !== undefined) {
      fs.writeFileSync(m.to, content);
      fs.unlinkSync(m.from);
      fileContents.delete(m.from);
      fileContents.set(m.to, content); 
    }
  }
});

filesToProcess.forEach(f => {
  if (!moveMap.has(f) && fileContents.has(f) && (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.css') || f.endsWith('.html'))) {
    fs.writeFileSync(f, fileContents.get(f));
  }
});

// Remove empty directories in server/src/modules
if (fs.existsSync(serverModules)) {
  const dirs = fs.readdirSync(serverModules);
  dirs.forEach(d => {
    const p = path.join(serverModules, d);
    if (fs.readdirSync(p).length === 0) fs.rmdirSync(p);
  });
  if (fs.readdirSync(serverModules).length === 0) fs.rmdirSync(serverModules);
}

// Remove empty directories in client/src
['models', 'views', 'controllers'].forEach(d => {
  const p = path.join(clientSrc, d);
  if (fs.existsSync(p)) {
    const files = fs.readdirSync(p);
    if (files.length === 0) {
      fs.rmdirSync(p);
    } else if (files.length === 1 && files[0] === '.gitkeep') {
      fs.unlinkSync(path.join(p, '.gitkeep'));
      fs.rmdirSync(p);
    }
  }
});

console.log("Migration complete!");
