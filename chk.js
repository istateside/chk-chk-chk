#! /usr/bin/env node
const { AutoComplete } = require('enquirer');
const simpleGit = require('simple-git');
const Fuse = require('fuse.js');

const git = simpleGit();

async function run() {
  const branchesSummary = await git.branchLocal({ '--sort': '-committerdate' });
  const choices = branchesSummary.all;

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

    return git.checkout(branchName);
  } catch(e) {
    // do nothing
  }
}

run();
