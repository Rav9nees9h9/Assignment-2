// short for "global configurations"
// JSON object which contains app-wide configuration values

//API keys for authentication of google and github
const configurations = {
    // key : value
    "db": "mongodb+srv://Ravneeshadmin:123@cluster1.rtcwxvg.mongodb.net/database",
    "github": {
        "clientId": "a1a3d8aee0db7104664f",
        "clientSecret": "f75ebe9e030aafbd499d21a77eda352e85b41fc0",
        "callbackUrl": "http://localhost:8300/github/callback"
    },
    "google":{
    
        "clientId" :'233695161849-d10nkqnuourd21p8rvpbobu0ujq8125l.apps.googleusercontent.com',
        "clientSecret" : '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',
        "callbackUrl" : 'http://localhost:8300/auth/google/callback'
    }
}
// export to make it available to the other files
module.exports = configurations;