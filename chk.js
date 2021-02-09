#! /usr/bin/env node
const { AutoComplete } = require('enquirer');
const Fuse = require('fuse.js');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function run() {

  const { stdout: branchNames } = await exec(`git branch --sort -committerdate --format="%(refname:short)"`);

  const choices = branchNames.split('\n');
  choices.splice(choices.length - 1, 1);

  const prompt = new AutoComplete({
    message: 'Select branch',
    name: 'branchName',
    choices,
    suggest: (input, choices) => {
      if (input === '') { return choices }
      return new Fuse(choices, { keys: ['value'] }).search(input).map(({ item }) => item);
    }
  });

  try { 
    const branchName = await prompt.run();

    console.log(`git checkout "${branchName}" ...`); 

    return exec(`git checkout ${branchName}`);
  } catch(e) {
    // do nothing
  }
}

run();
