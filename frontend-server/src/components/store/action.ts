import { createAction } from "@reduxjs/toolkit";
import { Planet, PlanetTasks, UserData } from "../../types";

export const redirectToRoute = createAction<string>('user/redirectToRoute');

export const changeGenre = createAction<{genre: string}>('changeGenre');

export const login = createAction<boolean>('data/setLogin');

export const setUserData = createAction<UserData>('user/userData');

export const setPlanets = createAction<Planet[]>('planet/setPlanets');

export const setPlanetTasks = createAction<PlanetTasks[]>('task/setTasks');