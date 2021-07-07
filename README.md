@gloxy/studio
=============

Manage local projects and demos in one place instantly and smoothly.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@gloxy/studio.svg)](https://npmjs.org/package/@gloxy/studio)
[![Downloads/week](https://img.shields.io/npm/dw/@gloxy/studio.svg)](https://npmjs.org/package/@gloxy/studio)
[![License](https://img.shields.io/npm/l/@gloxy/studio.svg)](https://github.com/GloryWong/studio/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @gloxy/studio
$ gs COMMAND
running command...
$ gs (-v|--version|version)
@gloxy/studio/0.0.0 darwin-x64 node-v14.17.2
$ gs --help [COMMAND]
USAGE
  $ gs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gs goodbye [FILE]`](#gs-goodbye-file)
* [`gs hello [FILE]`](#gs-hello-file)
* [`gs help [COMMAND]`](#gs-help-command)

## `gs goodbye [FILE]`

describe the command here

```
USAGE
  $ gs goodbye [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/goodbye.ts](https://github.com/GloryWong/studio/blob/v0.0.0/src/commands/goodbye.ts)_

## `gs hello [FILE]`

describe the command here

```
USAGE
  $ gs hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ gs hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/GloryWong/studio/blob/v0.0.0/src/commands/hello.ts)_

## `gs help [COMMAND]`

display help for gs

```
USAGE
  $ gs help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
