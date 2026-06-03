type ModuleData = {
  id: string;
  num: string;
  accent: string;
  commandStrings: string[];
};

export const MODULES: readonly ModuleData[] = [
  { id: 'module0', num: '00', accent: 'var(--ok)', commandStrings: ['git init', 'git add .', 'git commit -m "message"'] },
  { id: 'module1', num: '01', accent: 'var(--ok)', commandStrings: ['git add .', 'git commit -m "message"'] },
  { id: 'module2', num: '02', accent: 'var(--feat)', commandStrings: ['git checkout -b <branch>', 'git commit -m "message"'] },
  { id: 'module3', num: '03', accent: 'var(--ok)', commandStrings: ['git cherry-pick <hash>'] },
  { id: 'module4', num: '04', accent: 'var(--head)', commandStrings: ['git rebase <onto>'] },
  { id: 'module5', num: '05', accent: 'var(--ok)', commandStrings: ['git merge <branch>'] },
  { id: 'module6', num: '06', accent: 'var(--conflict)', commandStrings: ['git merge <branch>  # conflict'] },
  { id: 'module7', num: '07', accent: 'var(--head)', commandStrings: ['git reset --hard <hash>'] },
  { id: 'module8', num: '08', accent: 'var(--feat)', commandStrings: ['git stash', 'git checkout <branch>', 'git stash pop'] },
  { id: 'module9', num: '09', accent: 'var(--feat)', commandStrings: ['git rebase -i HEAD~N'] },
  { id: 'module10', num: '10', accent: 'var(--head)', commandStrings: ['git checkout <hash>', 'git checkout <branch>'] },
  { id: 'module11', num: '11', accent: 'var(--ok)', commandStrings: ['git reflog', 'git reset --hard <hash>'] },
];
