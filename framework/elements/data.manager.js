
import config from '../config/config';

import { users } from "../fixtures/users.fixture.js";

export class UserService {
    static async getToken (credentials) {
         const response = await fetch(`${config.baseUrl}/api/webclient/login`, {
             method: 'post',
             body: JSON.stringify(credentials),
             headers: { 'Content-Type': 'application/json' }
         });
         return response.headers.get('x-user-token');
    }
 }

export class CameraService {

    static async create(data) {
        
        const token = await UserService.getToken(config.credentials)
        const body = data

        const createResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/create`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const cameraInfo = await createResponse.json()
       
        return (cameraInfo)

    }

    static async delete(addedCams) {
        
        const token = await UserService.getToken(config.credentials)
        const body = {cameras: addedCams}

        const deleteResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/remove`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const response = await deleteResponse.json()
       
        return (response)

    }

    static async createStream(camId, stream) {
        const token = await UserService.getToken(config.credentials)
        const body = stream

        const createStreamResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/profiles/${camId}/create`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const streamInfo = await createStreamResponse.json()
        return (streamInfo.name)
    }

    static async createArchive(camId, archive) {
        const token = await UserService.getToken(config.credentials)
        const body = archive

        const createArchiveResponse = await fetch(`${config.baseUrl}/api/webclient/cameras/archive/${camId}/create`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-User-Token': token
            }
        });
        const archiveInfo = await createArchiveResponse.json()
        return (archiveInfo)
    }



}