Membres du groupe 
Slone Ngambo Mouafo
Joissaint karl

Pour ce projet, il est séparé en deux parties, front et back, dans deux dossiers distincts.
Après le clonnage vous devrez:
Naviger dans le dossier Back puis excécuter un npm install
ensuite, naviguer dans le dossier front puis excécuter un excécuter un npm install, et ensuite un npm install expo.
Vous pourrez ensuite lancer le front et le back séparément avec deux terminaux différents afin de pouvoir utiliser le projet correctement.

Vueillez noter que pour des raisons de testing l'authentification à été désactivée, afin de gagner momentanément du temps, mais le contenu est présent et fonctionnel si vous retournez dans les commits, je vous prie d'en tenir compte.
D'autre part, les commentaires que nous avons ajoutés sont tous en anglais intentionnellement, car cela reste une bonne pratique veuillez ne pas considérer cela comme une preuve d'utilisation de l'ia.
Ensuite le travail à été réalisé grace à l'extension liveshare de microsoft vscode afin de gagner du temps, donc ne tenez pas compte de l'auteur des commits comme preuve que ce dernier aurait travaillé seul.


features:


## **page de login**

1. correction  champ mot de passe style inconsistant, fix en appliquant le même style que le champ email
2. Fix l’icone de “montrer mot de passe” afin qu’il soit visible et reste cohérent avec le reste du style
3. Ajouté vérification du mail avec du regex.
    1. Page de login
    2. page register
4. Ajouté vérification du mot de passe avec du regex une fois de plus
    1. Page de login
    2. Page register
    
    Centralisation de quelques règles de style afin d’alléger la page et optimiser la maintenance.
    

## **Page de Trips**

1. Centralisation de quelques règles de style afin d’alléger la page et optimiser la maintenance.
2. Dynamisation de la récupération des voyages, permettant d’utiliser l’api au lieu d’avoir les voyages codés en durs.
3. Parmi les opérations CRUD celles qui sont fonctionnelles sont les suivantes
    1. Read: l’entièreté des voyages sont récupérés et peuvent être lus
        1. Search Bar fonctionnelle également
    2. Début d’implementation du Delete, mais inachevé pour l’instant

## General

corrigé le looping des notifications.

suite à un problème technique, la vidéo n'a pas pu être faite dans les temps,
et la génération de l'apk également, je vous prie d'utiliser le lien expo go généré par le projet, Merci d'avance!
