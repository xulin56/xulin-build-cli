#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const program = require('commander');
const inquirer = require('inquirer')
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');

program
  .version('0.1.0')
  .option('i, init', '初始化xulin-build项目')

program
  .parse(process.argv);

const nameQuestion = {
  type: 'input',
  message: `项目名称: `,
  name: 'name',
  default: 'xulin-build'
};

const versionQuestion = {
  type: 'input',
  message: `初始版本: `,
  name: 'version',
  default: '1.0.0'
};

const templateQuestion = {
  type: 'confirm',
  message: `使用pug(jade)模版引擎? `,
  name: 'template',
  default: false
};

const reactRouter = {
  type: 'confirm',
  message: `使用react-router? `,
  name: 'router',
  default: false
};

if (program.init) {
  console.info('');
  inquirer.prompt([
    nameQuestion,
    versionQuestion,
    // templateQuestion,
    reactRouter
  ]).then(function (answers) {
    const spinner = ora('正在为您构建项目，请稍后....').start();
    download('xulin56/xulin-build', answers.name, function (err) {
      if (!err) {
        spinner.clear()
        console.info('');
        console.info(chalk.green('-----------------------------------------------------'));
        console.info('');
        spinner.succeed(['项目创建成功,请继续进行以下操作:'])
        console.info('');
        console.info(chalk.cyan(` -  cd ${answers.name}`));
        console.info(chalk.cyan(` -  npm install / yarn install`));
        console.info(chalk.cyan(` -  npm start / yarn start`));
        console.info('');
        console.info(chalk.gray(`devServer: http://localhost:${answers.port}`));
        console.info('');
        console.info(chalk.gray('参考文档: https://github.com/xulin56/newScaffold'));
        console.info('');
        console.info(chalk.green('-----------------------------------------------------'));
        console.info('');
        if (answers.router === true) {
          fs.unlinkSync(`${process.cwd()}/${answers.name}/src/index.html`);
        } else {
          fs.unlinkSync(`${process.cwd()}/${answers.name}/src/index.pug`);
        }
        fs.readFile(`${process.cwd()}/${answers.name}/package.json`, (err, data) => {
          if (err) throw err;
          let _data = JSON.parse(data.toString())
          _data.name = answers.name
          _data.version = answers.version
          _data.port = answers.port
          _data.template = answers.template ? "pug" : "html"
          _data.rem = answers.rem
          let str = JSON.stringify(_data, null, 4);
          fs.writeFile(`${process.cwd()}/${answers.name}/package.json`, str, function (err) {
            if (err) throw err;
            process.exit()
          })
        });
      } else {
        spinner.warn(['发生错误，请在https://github.com/xulin56，Issues留言'])
        process.exit()
      }
    })
  });
}
