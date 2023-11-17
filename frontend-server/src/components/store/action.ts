import { createAction } from "@reduxjs/toolkit";
import { CuratorPlanetData, Planet, PlanetTasks, UserData, UserOnPlanetData } from "../../types";

export const redirectToRoute = createAction<string>('user/redirectToRoute');

export const login = createAction<boolean>('data/setLogin');

export const logOut = createAction('data/logOut');

export const setUserData = createAction<UserData>('user/userData');

export const setPlanets = createAction<Planet[]>('planet/setPlanets');

export const setPlanetTasks = createAction<PlanetTasks[]>('task/setTasks');

export const setPlanet = createAction<CuratorPlanetData>('planet/setPlanet')

export const clearCurrentPlanet = createAction('planet/clearCurrentPlanet')

export const changePlanetName = createAction<{name: string, idBlock: number}>('planet/changePlanetName')

export const setEmployees = createAction<UserOnPlanetData[]>('user/setEmployees')

export const changeTaskData = createAction<{name: string, description: string, idTask: number}>('task/changeTaskData')