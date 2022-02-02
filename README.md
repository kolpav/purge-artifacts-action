# No longer maintained

This project was created as temporary solution to problem I saw a lot of people to have but it seems people at github have no intention of fixing and neither do I.
I recommend looking at other projects or you could use this as starting point for your own action.

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

I would take a look at other maintained projects and contribute to them.
