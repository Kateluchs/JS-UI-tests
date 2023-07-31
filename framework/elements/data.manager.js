
import config from '../config/config';

import { users } from "../fixtures/users.fixture.js";

export class User {
    constructor(user) {
        this.user = user
    }

    async login() {
        const body = this.user
        const response = await fetch(`${config.baseUrl}/api/webclient/login`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        const token = response.headers.get('x-user-token');
        return (token);
    }

}

export class Camera {

    constructor(camera) {
        this.camera = camera
    }

    async data(){
        return(this.camera)
    }

    async create() {
        
        const token = await new User(users.admin).login()
        const body = this.camera

        const camResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/create`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const cameraInfo = await camResponse.json()
       
        return (cameraInfo)

    }

    async delete(addedCams) {
        
        const token = await new User(users.admin).login()
        const body = {cameras: addedCams}

        const camResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/remove`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const response = await camResponse.json()
       
        return (response)

    }

    async createStream(camId, stream) {
        const token = await new User(users.admin).login()
        const body = stream

        const streamResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/profiles/${camId}/create`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const streamInfo = await streamResponse.json()
        return (streamInfo.name)
    }

    async createArchive(camId, archive) {
        const token = await new User(users.admin).login()
        const body = archive

        const streamResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/archive/${camId}/create`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const streamInfo = await streamResponse.json()
        return (streamInfo)
    }



}