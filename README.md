# CV Terminal

## Lancer le projet

- Pour lancer le projet en dev : `npm run dev`
- Pour build le projet en prod : `npm run build`

## Usage

### resume.json

Le fichier `resume.json` contient l'ensemble des étapes à afficher.

> /!\ Tous les objets doivent avoir un champs `id` unique !

Il y a trois structures d'objets possibles :

#### responseType = list

Le terminal affichera une liste de champs contenus dans `value`

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
Affichera un tableau, ce type l'objet doit contenir: 
- `headers`: Ensemble des entêtes du tableau
- `rows`: Un tableau contenant les lignes du tableau
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
Affiche simplement du texte contenue dans le champs `value`.
```json
{
    "id": 4,
    "line": "find . -type f -print | xargs grep \"hobby\"",
    "responseType": "text",
    "value": "Bonsoir"
}
```
