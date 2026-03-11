const bcrypt = require('bcrypt');

let password = "carla";

bcrypt.hash(password,10).then(hash =>{
    console.log(hash);
})

// Para ejecutarlo: "node scripts/hash.js", ejemplo:
/* cfgs@insmarianao:~/Escriptori/Proyecto/truckwave$ node script/hash.js
    $2b$10$80SdfHbxopAXgQR.8KJZiOj8m5bGS0gDZutRiE60qnsOhsP5eaDre */

// Luego se actualiza a la BBDD de Neon

/*UPDATE dispatcher SET "Contraseña" = 'contraseña hasheada' WHERE dispatcher."Email" = 'carla@truckwave.com' */