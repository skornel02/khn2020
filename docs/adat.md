# Adatok

A rendszerben az adatokat egyénileg gyártott tartalomtípusokban tároljuk.

Az alábbi listában a részletes típusokat láthatjuk:



## Tartalomtípusok

### Kérelem

```json
{
    "title":{
        "type": "string",
        "example": "ExampleRequest"
    },
    "field_leiras": {
        "type": "string",
        "example": "ExampleDescription"
    },
    "field_letrehozasi_datum": {
        "type": "unix-epoch",
        "example": "1587234686"
    },
    "field_allapot":{
        "type": "integer",
        "valid_options": [
            0,
            1,
            2
        ],
        "example": "1"
    }
}
```



### Napirend

```json
{
    "title":{
        "type": "string",
        "example": "ExampleSchedule"
    },
    "field_hatarido":{
        "type": "string",
        "example": "YYYY-MM-DD"
    },
    "field_idotartam":{
        "type": "string",
        "example": "HH:MM:SS"
    },
    "field_ismetlesi_szabaly":{
        "type": "string",
        "example": "0 9 * * *"
    },
    "field_kezdesi_datum":{
        "type": "string",
        "example": "YYYY-MM-DD"
    },
    "field_kezdesi_ido":{
        "type": "string",
        "example": "HH:MM:SS"
    },
    "field_megjegyzes":{
        "type": "string",
        "example": "ExampleNotice"
    },
    "field_resztvevok":{
        "type": "reference",
        "reference_with": "[\"<uuid>\"]",
        "example": "[\"36857dcb-da81-4c2a-8a9c-7e380379970c\"]"
    },
    "field_sav":{
        "type": "reference",
        "reference_with": ["<uuid>"],
        "example": "[\"36857dcb-da81-4c2a-8a9c-7e380379970c\"]"
    }
}
```



### Sáv

```json
{
	"title":{
        "type": "string",
        "example": "LocationName"
    }
}
```



### Tiltás

```json
{
    "title":{
        "type": "string",
        "example": "ExampleProhibition"
    },
    "field_idotartam":{
        "type": "string",
        "example": "HH:MM:SS"
    },
    "field_t_ismetlesi_szabaly":{
        "type": "string",
        "example": "0 9 * * *"
    },
    "field_t_kezdesi_ido":{
        "type": "string",
        "example": "HH:MM:SS"
    },
    "field_resztvevok":{
        "type": "reference",
        "reference_with": ["<uuid>"],
        "example": "[\"36857dcb-da81-4c2a-8a9c-7e380379970c\"]"
    }
}
```

