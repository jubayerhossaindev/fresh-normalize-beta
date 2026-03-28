import { Client, connect } from '@dagger.io/dagger';

connect(
  async (client: Client) => {
    const source = client.host().directory('.', {
      exclude: [
        'node_modules',
        'dist',
        'artifacts',
        'dagger-pipeline.ts',
        'dagger.sh',
        'dist-docs',
        'coverage',
      ],
    });

    let base = client
      .container()
      .from('node:24-slim')
      .withDirectory('/src', source)
      .withWorkdir('/src')
      .withExec(['apt-get', 'update'])
      .withExec(['apt-get', 'install', '-y', 'curl'])
      // actionlint ডাউনলোড করা হচ্ছে (GitHub Action ভ্যালিডেশনের জন্য)
      .withExec([
        'bash',
        '-c',
        'curl -sS https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash | bash',
      ])
      .withExec(['mv', 'actionlint', '/usr/local/bin/'])
      .withExec(['npm', 'install', '-f']);

    console.log('⚡ Starting Full Quality Check (including Dependabot) & Build...');

    // ১. Dependabot এবং সব YAML ফাইল চেক (npx yaml-lint)
    // এটি .github/workflows/*.yml এর পাশাপাশি .github/dependabot.yml ও চেক করবে
    const yamlCheckJob = base.withExec([
      'bash',
      '-c',
      'npx yaml-lint .github/workflows/*.yml .github/dependabot.yml',
    ]);

    // ২. GitHub Action লিন্টিং (এটি অ্যাকশন আপডেট এবং সিনট্যাক্স চেক করবে)
    const actionlintJob = base.withExec([
      'bash',
      '-c',
      'actionlint -shellcheck= .github/workflows/*.yml',
    ]);

    // ৩. কোড লিন্ট, টেস্ট এবং বিল্ড জব
    const lintFix = base.withExec(['npm', 'run', 'lint:fix']);
    const lintCheckJob = lintFix.withExec(['npm', 'run', 'lint']);
    const mainBuildJob = base.withExec(['npm', 'run', 'build']);
    const testJob = base.withExec(['npm', 'run', 'test:unit']);

    try {
      // সবগুলো চেক একসাথে রান করা
      await Promise.all([
        yamlCheckJob.stdout(),
        actionlintJob.stdout(),
        mainBuildJob.stdout(),
        testJob.stdout(),
        lintCheckJob.stdout(),
      ]);

      await mainBuildJob.directory('dist').export('./dist');
      await testJob.directory('coverage').export('./artifacts/coverage');

      console.log('✅ Success! Workflows, Dependabot, and Code are all valid.');
    } catch (err) {
      console.error('❌ Pipeline failed. Check above logs for YAML or Action errors.');
      process.exit(1);
    }
  },
  { LogOutput: process.stdout },
);
