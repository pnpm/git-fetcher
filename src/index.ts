import dint = require('dint')
import execa = require('execa')
import path = require('path')
import rimraf = require('rimraf-then')

export default () => {
  return {
    git: async function fetchFromGit (
      resolution: {
        repo: string,
        commit: string,
      },
      dest: string,
    ) {
      await execGit(['clone', resolution.repo, dest])
      await execGit(['checkout', resolution.commit], {cwd: dest})
      // removing /.git to make directory integrity calculation faster
      await rimraf(path.join(dest, '.git'))
      return dint.from(dest)
    },
  }
}

function prefixGitArgs (): string[] {
  return process.platform === 'win32' ? ['-c', 'core.longpaths=true'] : []
}

function execGit (args: string[], opts?: object) {
  const fullArgs = prefixGitArgs().concat(args || [])
  return execa('git', fullArgs, opts)
}
