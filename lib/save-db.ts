import {env} from 'cloudflare:workers';
export function saveDb(){if(!env.DB)throw new Error('Save storage unavailable');return env.DB;}
