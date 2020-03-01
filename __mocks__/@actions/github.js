const github = jest.genMockFromModule('@actions/github')

github.context.repo = {
  repo: "https://github.com/kolpav/purge-artifacts-action",
  owner: "kolpav"
}

module.exports = github
