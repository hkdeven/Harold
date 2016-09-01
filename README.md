# Harold

Harold is the UI layer for alliedbuildings.com. Harold also serves Allied's header and footer, assets and Style Guide.

The main goal of Harold is to enable sharing of templates and assets across all Allied applications. This helps us to reduce complexity and increase reusability.


## Install & Get Dependencies

```bash
$ git clone git@github.com:hkdeven/harold.git && cd harold
$ cp .ruby-version.example .ruby-version
$ cp .ruby-gemset.example .ruby-gemset
$ cd .
$ bundle install
$ npm install
$ grunt setup # sets up jscs & jshint git precommit hook for contributors, and inits the private font submodule
```

### Note for non Allied staff

Due to licensing restrictions imposed on our fonts you will have to manually create some empty files in order to run Harold locally:

```bash
$ touch app/assets/stylesheets/fonts/_font.sass
$ touch app/assets/stylesheets/fonts/_font_woff2.sass
```

## Documentation

We recommend [Slate](https://github.com/lord/slate) to help create beautiful and automated documention.
