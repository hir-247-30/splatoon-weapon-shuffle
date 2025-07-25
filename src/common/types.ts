export type Weapon = {
  name : string;
  lc   : string;
  sc   : string;
  role : 'PAINT' | 'BALANCED' | 'KILL' | 'TANK' | 'FREE';
  range: 'SHORT' | 'MID' | 'LONG' | 'FREE';
}

export type Report = {
    player_name : string,
    weapon_name : string,
    weapon_role : string,
    weapon_range: string,
};