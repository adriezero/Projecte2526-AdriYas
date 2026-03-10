const bcrypt = require('bcrypt');
const { hash } = require('node:crypto');
let password="carla";

bcrypt.hash(password,10).then(hash =>{
    console.log(hash)

})

/* -- Failed query:
-- UPDATE dispatcher SET Contraseña = '$2b$10$ebr3/GwJaqO5APEGu1F9YuuriB32v8Xv4soKLUeFWQ6jXQa8Jd5rK' WHERE dispatcher.Email = 'juan@truckwave.com'
UPDATE dispatcher SET "Contraseña" = '$2b$10$rOoIHg9swvDJsbbnv5Wg4.oBzdqfAaOAiC3HhsjStBAJj40/c1KbS' WHERE dispatcher."Email" = 'carla@truckwave.com' */
/* 
cfgs@insmarianao:~/Escriptori/Proyecto/truckwave$ node script/hash.js
$2b$10$80SdfHbxopAXgQR.8KJZiOj8m5bGS0gDZutRiE60qnsOhsP5eaDre */