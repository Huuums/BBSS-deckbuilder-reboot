# BBSS Deckbuilder

## How to add a new Trainer

Open the `types.ts` file located at `src/types/types.ts` and add the Trainername to the `TrainerNames` type.

Open the `trainers.ts` file located at `src/assets/json/trainers.ts` and add the Data for a new Trainer in there.

Get the image of the trainer out of the gamefiles and name it like the trainer (i.e. The image from Yeomra should be named `Yeomra.png`) and add it to the `src/assets/images/trainer` folder

Open a PR with the changes to the main branch. As soon as the pull request is accepted the changes will be deployed to the site.

## How to add a new Skills

Open the `skillDefinitions.ts` file located at `src/assets/json/skillDefinitions.ts` and add the Skill to the file.

Open a PR with the changes to the main branch. As soon as the pull request is accepted the changes will be deployed to the site.
