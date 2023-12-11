#!/usr/bin/env node
const { program } = require('commander');
const readline = require('readline');
const { createPERN }= require('./PERN_SB');
const { createREFLK }= require('./create-phase4-app');

program
  .version('1.0.0')
  .description('Create a full-stack project template');

program
  .command('create <projectName>')
  .description('Create a new full-stack project')
  .action(async (projectName) => {
    // Check if a project name is not given and ask for one
    if (!projectName) {
      projectName = await askQuestion('Please enter a project name: ');
    }

    // Display project type options with colors
    console.log('\x1b[36m%s\x1b[0m', 'Choose a project type:');
    console.log('\x1b[32m%s\x1b[0m', '1. PERN with Supabase');
    console.log('\x1b[35m%s\x1b[0m', '2. React with Flask');

    // Read user input for project type
    const projectType = await askQuestion('Enter the number corresponding to your choice: ');

    // Handle project creation based on user input
    if (projectType === '1') {
      // For PERN with Supabase
      const supabaseUrl = 'add_value_to_.env_and_.env.local';
      const supabaseAnon = 'add_value_to_.env_and_.env.local';
      const supabaseSecret =  'add_value_to_.env_and_.env.local';

      console.log('\x1b[33m%s\x1b[0m', 'Enter Supabase credentials:');

      const updatedSupabaseUrl = await askQuestion(`Supabase URL: `, supabaseUrl);
      const updatedSupabaseAnon = await askQuestion(`Supabase Anon Key:  `, supabaseAnon);
      const updatedSupabaseSecret = await askQuestion(`Supabase Secret Key: `, supabaseSecret);

      createPERN(projectName, updatedSupabaseUrl, updatedSupabaseAnon, updatedSupabaseSecret);
    } else if (projectType === '2') {
      // For React with Flask
      createREFLK(projectName);

    } else {
      console.log('Invalid choice. Exiting...');
      process.exit(0);
    }

    console.log(`Project ${projectName} created successfully!`);
    process.exit(0);
  });

// Function to ask a question and return the user's answer
function askQuestion(question, defaultValue = '') {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`${question}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

program.parse(process.argv);
