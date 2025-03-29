export type RawWeapon = {
    name   : string,
    lc     : 'SHOOTER'|'ROLLER'|'WIPER'|'SPINNER'|'CHARGER',
    sc     : string,
    role   : 'PAINT'|'BALANCED'|'KILL',
    range  : 'SHORT'|'MID'|'LONG',
    charger: boolean,
    tank   : boolean,
};

export type Report = {
    player_name: string,
    weapon_name: string,
};