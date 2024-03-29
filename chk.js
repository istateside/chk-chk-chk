#! /usr/bin/env node
const { AutoComplete } = require('enquirer');
const Fuse = require('fuse.js');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function run() {
  let branchNames;
  try {
    const result = await exec(`git branch --sort -committerdate --format="%(refname:short)"`);
    branchNames = result.stdout;
  } catch (e) {
    console.log('failed to get git branches');
    process.exit(1);
  }

  const choices = branchNames.split('\n');
  choices.splice(choices.length - 1, 1);

  const prompt = new AutoComplete({
    message: 'Select branch',
    name: 'branchName',
    limit: 30,
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
