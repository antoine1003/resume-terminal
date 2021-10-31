# Resume Terminal

## Run the project

- To run in dev mode : `npm run dev`
- To build for production : `npm run build`

## Usage

### resume.json

File `resume.json` contain all steps.

> /!\ All objects needs to have a unique `id` !

For now, there are 3 possible steps :

#### responseType = list

To display a bullet list, the `value` field is an array of string.

```json
{
  "id": 1,
  "line": "whois adautry",
  "responseType": "list",
  "value": [
    "A 27 years old full stack developper",
    "3 years of experiences",
    "Living in Nantes"
  ]
}
```

#### responseType = table

Display a table, this object requires two fields :

- `headers`: Headers of the array
- `rows`: Array containing rows

```json
{
  "id": 2,
  "line": "whereis experiences",
  "responseType": "table",
  "headers": [
    "Date",
    "Client",
    "Description",
    "Tech"
  ],
  "rows": [
    [
      "2021",
      "La Poste",
      "Internal tool to schedule techniciens on interventions.",
      "Angular 11, Spring Boot/Batch, Genetic algorithm"
    ],
    [
      "2020",
      "DSI",
      "Maintenance of a timesheet internal tool. Development of plugins for our ProjeQtor instance.",
      "Symfony, Angular 8"
    ]
  ]
}
```

#### responseType = text

Just display text contained in `value`.

```json
{
    "id": 4,
    "line": "find . -type f -print | xargs grep \"hobby\"",
    "responseType": "text",
    "value": "Bonsoir"
}
```

#### responseType = code

Display code between `pre` tag, `value` is an array of string, each string is a line.

```json
{
    "id": 1,
    "line": "curl https://adautry.fr/user/03101994",
    "responseType": "code",
    "value": [
      "{",
      "   \"name\":\"Antoine DAUTRY\",",
      "   \"job\":\"Fullstack developper\",",
      "   \"experience\":\"3 years\",",
      "   \"city\":\"Nantes\"",
      "}"
    ]
}
```
