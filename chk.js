#! /usr/bin/env node
const { AutoComplete } = require('enquirer');
const simpleGit = require('simple-git');

const git = simpleGit();

async function run() {
  const branchesSummary = await git.branchLocal({ '--sort': '-committerdate' });
  const branches = branchesSummary.all;


  const prompt = new AutoComplete({
    message: 'Select branch',
    name: 'branchName',
    choices: branches,
  });

  const branchName = await prompt.run();

  return git.checkout(branchName);
}

run();
