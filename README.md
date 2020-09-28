# Delete artifacts action

Action responsible for deleting old artifacts by setting expire duration.

Hopefuly this is just temporary solution till github implements this functionality natively.

## Inputs
### `expire-in`
**Required** for how long the artifacts should be kept.
Most of the human readable formats are supported `10 minutes`, `1hr 20mins`, `1week`.
Take a look at [parse-duration](https://github.com/jkroso/parse-duration) for more information.


## Outputs
### `deleted-artifacts`
Serialized list of deleted artifacts. Empty `[]` when nothing is deleted

## Usage

Run this action as cron. This won't delete artifacts of running workflows because they
are persisted after workflow completion.

```yaml
name: 'Delete old artifacts'
on:
  schedule:
    - cron: '0 * * * *' # every hour

jobs:
  delete-artifacts:
    runs-on: ubuntu-latest
    steps:
      - uses: kolpav/purge-artifacts-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          expire-in: 7days # Setting this to 0 will delete all artifacts
```

### Optional arguments

#### `onlyPrefix`

Only purge artifacts that start with `tmp_` as a prefix.

```yaml
with:
  onlyPrefix: tmp_  
```

#### `exceptPrefix`

Exclude any artifacts that start with `prod_` as a prefix

```yaml
with:
  exceptPrefix: prod_
```

## Contributing

There are few improvements to be made, namely
- More delete strategies (name, size, number of occurences, regex match on name etc..)
- Better test coverage
