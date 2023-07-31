import { faker } from '@faker-js/faker';

export const discoveryResponses = {

    empty() {
        return ({ "existingCameras": 0, "cameras": [], "status": "OK" })

    },

    existingAddedCameras() {
        return ({
            "existingCameras": 1,
            "cameras": [
                {
                    "instances": [
                        {
                            "name": "Discovery added camera",
                            "id": "3ba012d1-fa6b-4a32-9e0e-281151d3ccfd"
                        }
                    ],
                    "httpPort": 80,
                    "rtspPort": null,
                    "host": "127.0.0.28",
                    "onvifPort": null,
                    "matched": [
                        {
                            "vendor": "onvif",
                            "model": "onvifcamera"
                        },
                        {
                            "vendor": "ltv",
                            "model": "othermodel"
                        },
                        {
                            "vendor": "ltv",
                            "model": "otherptzmodel"
                        },
                        {
                            "vendor": "ltv",
                            "model": "cne92058"
                        }
                    ]
                },
                {
                    "instances": [],
                    "httpPort": 80,
                    "rtspPort": null,
                    "host": "127.0.0.96",
                    "onvifPort": null,
                    "matched": [
                        {
                            "vendor": "onvif",
                            "model": "onvifcamera"
                        }
                    ]
                }


            ], "status": "OK"
        })
    }

}


export const cameras = {

    random() {
        return (
            {
                name: faker.lorem.words(),
                login: faker.internet.userName(),
                password: faker.internet.password(),
                cloud: faker.datatype.boolean(),
                echd: faker.datatype.boolean(),
                host: faker.internet.ipv4(),
                httpPort: faker.internet.port(),
                model: "otherfixed",
                onvifPort: faker.internet.port(),
                ptz: faker.datatype.boolean(),
                rtspPort: faker.internet.port(),
                tcp: faker.datatype.boolean(),
                vendor: "other"
            })
    }
}

export const streams = {
    default() {
        return ({
            rtspPath: "/",
            screenPath: "/"
        })
    }
}

export const archives = {
    default(stream) {
        return ({ enabled: false, conditions: false, schedules: [], storageId: "2", profile: stream, quota: 864000 })
    }
}