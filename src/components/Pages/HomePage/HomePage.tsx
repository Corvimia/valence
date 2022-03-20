import React, { Fragment } from 'react';
import { List, ListItem, Typography } from "@mui/material";

const todos: { [key: string]: string[] } = {
  "Features": [
    "Attributes",
    "Skills",
    "Rumours",
    "Sessions",
    "Character History",
    "And more...?",
  ],
  "Technical": [
    "Auto create DB if it doesn't exist",
    "Create component for List and Create",
    "Loading States",
    "Text validation to avoid errors",
  ],
}


export interface HomePageProps {
}

export const HomePage: React.VFC<HomePageProps> = () => {


  return (
    <>
      <Typography variant="h3">Home</Typography>
      <Typography variant="body1">Some filler about the homepage</Typography>
      <br/>
      <Typography variant="h5">TODO:</Typography>
      <List>
        {Object.keys(todos).map((section, sectionIx) => <Fragment key={section}>
          <ListItem>{sectionIx + 1}. {section}:</ListItem>
          <List sx={{ pl: 4 }}>
            {todos[section].map((todo, todoIx) =>
              <ListItem key={todo}>{(todoIx + 10).toString(36)}. {todo}</ListItem>)}
          </List>
        </Fragment>)}
      </List>
    </>
  );
};
