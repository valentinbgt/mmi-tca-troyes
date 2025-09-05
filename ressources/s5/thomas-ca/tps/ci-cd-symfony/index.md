
## Introduction

Dans cet exercice, vous allez mettre en place une chaîne d'intégration et de déploiement continus (CI/CD) pour un projet Symfony. L'objectif est de vous familiariser avec les outils et les bonnes pratiques pour automatiser les tests, la vérification du code et le déploiement. Vous utiliserez des outils comme **PHP-CS-Fixer**, **PHPStan**, **PHPUnit**, **Composer Audit** et **GitHub Actions**.

---

## 🛠️ Préparation de l'environnement

### 1. Forker le dépôt

- Rendez-vous sur le dépôt GitHub suivant : [https://github.com/langouste/mmi-tca-troyes](https://github.com/langouste/mmi-tca-troyes)
- Cliquez sur **Fork** pour créer une copie du dépôt dans votre compte GitHub.

### 2. Cloner préparer le projet

Clonez votre fork sur votre machine locale :

```bash
git clone <https://github.com/><user>/mmi-tca-troyes
```

Créer ton espace de travail sous le format `<prénom>-<2-premières-lettres-du-nom>` (ex: thomas-ca), puis préparer un nouveau projet à partir du modèle situé dans `ressources/s5/thomas-ca/tps/ci-cd-symfony`

```bash
export USER_SLUG=<prénom>-<2-premières-lettres-du-nom>
cd ressources/s5/
mkdir -p $USER_SLUG/projets
cp -r thomas-ca/tps/ci-cd-symfony/repository $USER_SLUG/projets/ci-cd-symfony
cd $USER_SLUG/projets/ci-cd-symfony
```

### 3. Construire l'environnement Docker

Dans le nouveau projet construisez l'image Docker pour le service PHP :

```bash
docker compose build php
```

### 4. Installer les dépendances avec Composer

Installez les dépendances du projet Symfony en utilisant Composer :

```bash
docker compose run php composer install
```


### 5. Démarrer l'environnement Docker

Démarrez les conteneurs Docker :

```bash
docker compose up -d
```

L'application devrait être accéssible sur `http://localhost:8080/welcome`.


### 6. Accéder au shell du conteneur PHP

Accédez au shell du conteneur PHP pour exécuter les commandes suivantes :

```bash
docker compose exec php bash
```

⚠️ **Attention** : Sauf mention contraire, toutes les commandes suivantes doivent être exécutées dans ce conteneur.

---

## 🧹 Linting : PHP-CS-Fixer

### Objectif

PHP-CS-Fixer est un outil qui permet de vérifier et de corriger la syntaxe du code selon les standards de codage (PSR-12, Symfony, etc.).

### Étapes

1. **Installer PHP-CS-Fixer** :

    - Installez PHP-CS-Fixer en tant que dépendance de développement :

```bash
composer require --dev friendsofphp/php-cs-fixer
```

2. **Tester la syntaxe** :

    - Exécutez PHP-CS-Fixer en mode dry-run pour identifier les erreurs de style :

```bash
./vendor/bin/php-cs-fixer fix --dry-run --diff
```

3. **Corriger les erreurs** :

    - Vous pouvez corriger les erreurs manuellement ou automatiquement avec PHP-CS-Fixer :

```bash
./vendor/bin/php-cs-fixer fix
```

4. **Vérifier à nouveau** :

    - Exécutez à nouveau le test pour vous assurer que tout est correct :

```bash
./vendor/bin/php-cs-fixer fix --dry-run --diff
```


---

Avec ces étapes, vous garantissez que votre code respecte les standards de codage et est propre et maintenable. 🚀

## 🔍 Syntax-checking : `php -l`

### Objectif

La commande `php -l` permet de vérifier la syntaxe des fichiers PHP sans les exécuter.

### Étapes

1. **Vérifier tous les fichiers PHP** :

    - Exécutez la commande suivante pour vérifier la syntaxe des fichiers dans les répertoires `src/` et `tests/` :

```bash
find src tests -name "*.php" -exec php -l {} \;
# Avec certains shell il faut utilise cette syntax :
# find src tests -name "*.php" -exec php -l {} \\;
```


---

## 🛡️ Tests de sécurité : PHPStan

### Objectif

PHPStan est un outil d'analyse statique qui détecte les erreurs dans le code sans l'exécuter.

### Étapes

2. **Installer PHPStan** :

    - Installez PHPStan avec Composer :

```bash
composer require --dev phpstan/phpstan
```

3. **Analyser le code** :

    - Exécutez PHPStan pour analyser votre code :

```bash
./vendor/bin/phpstan analyse
```

4. **Corriger les erreurs** :

    - Constatez les erreurs dans `src/Controller/BuggyController.php`.

    - Modifiez le code pour que getData() renvoie un tableau avec des valeurs numériques :

```php
	/**
     * @return array<string, number>
     */
    private function getData(): array
    {
        return [
            "key1" => 1,
            "key2" => 2,
        ];
    }
```

---

## 🧪 Tests unitaires : PHPUnit

### Objectif

PHPUnit est un framework de test unitaire pour PHP. Vous allez tester un service métier qui calcule des remises sur une commande.

### Étapes

6. **Installer PHPUnit** :

    - Installez PHPUnit avec Composer :

```bash
composer require --dev phpunit/phpunit
```

7. **Comprendre le service `DiscountCalculator`** :

  - Le service `src/Service/DiscountCalculator.php` applique des remises selon les règles suivantes :
      1. Si le montant total de la commande est supérieur à 100 €, une remise de 10 % est appliquée.
      2. Si le client est un membre fidèle (VIP), une remise supplémentaire de 5 % est appliquée.
      3. Les remises ne peuvent pas dépasser 20 % du montant total de la commande.

8. **Comprendre et exécuter les tests** :

    - Observez les cas de tests implémentés dans `tests/Service/DiscountCalculatorTest.php`.

    - Lancez les tests unitaires :

```bash
./vendor/bin/phpunit
```

9. **Corriger les erreurs** :

    - Ici c’est à vous de modifiez le service `DiscountCalculator` pour qu'il respecte les spécifications.

10. **Vérifier que tous les tests passent** :

    - Exécutez à nouveau les tests pour vous assurer que tout fonctionne correctement :

```
	./vendor/bin/phpunit
```

---

## 🔒 Test de vulnérabilité dans les dépendances : Composer Audit

### Objectif

Composer Audit permet de vérifier que les dépendances du projet ne contiennent pas de vulnérabilités connues.

### Étapes

1. **Vérifier les vulnérabilités** :

    - Exécutez Composer Audit pour vérifier les dépendances :
 ```bash
composer audit --format=json --no-interaction
```

---

## 🤖 GitHub Actions

### Objectif

GitHub Actions est un outil puissant qui permet d'automatiser les tests, les vérifications et les déploiements à chaque `push` ou `pull request`. Dans cette section, vous allez découvrir comment configurer et exécuter un workflow CI/CD pour un projet Symfony.

### 📂 Analyse du fichier `run-tests.yml`

Les workflows GitHub Actions sont définis dans des fichiers YAML placés dans le dossier **`.github/workflows/`**. Ici, le fichier **`run-tests.yml`** reprend les étapes d'intégration continue vues précédemment pour automatiser leur exécution à chaque ajout de code.

Voici le contenu du fichier :

```yaml
name: Symfony CI

on:
  push:
    branches:
      - main
    paths:
      - "ressources/s5/thomas-ca/projets/ci-cd-symfony/**"

defaults:
  run:
    working-directory: ressources/s5/thomas-ca/projets/ci-cd-symfony

jobs:
  ci-symfony:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: pcov

      - name: Install dependencies
        run: composer install --no-progress --prefer-dist --no-scripts

      - name: Run PHP-CS-Fixer
        run: ./vendor/bin/php-cs-fixer fix --dry-run --diff

      - name: Run PHP lint
        run: find src tests -name "*.php" -exec php -l {} \\;

      - name: Run PHPStan
        run: ./vendor/bin/phpstan analyse

      - name: Run PHPUnit
        run: ./vendor/bin/phpunit --coverage-text --coverage-clover=coverage.xml

      - name: Audit de sécurité
        run: composer audit --format=json --no-interaction
        continue-on-error: true # Permettre au CI de continuer même si des vulnérabilités sont détectées
```

## 🔍 Explication des sections clés

### 1. Déclencheurs

```yaml
on: [push]
```

- Le workflow est déclenché à chaque fois qu'un commit est poussé (`push`) sur n'importe quelle branche du dépôt.

### 2. Jobs

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
```

- Un seul job, nommé `ci`, est défini.
- Ce job s'exécute sur une machine virtuelle avec le système d'exploitation **Ubuntu** (version la plus récente).

### 3. Étapes du job

### Étape 1 : Checkout du code

```yaml
      - uses: actions/checkout@v4
```

- Cette étape utilise l'action `actions/checkout@v4` pour récupérer le code source du dépôt GitHub.
- Sans cette étape, le workflow n'aurait pas accès au code du projet.

### Étape 2 : Configuration de PHP

```yaml
      - name: Set up PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          coverage: pcov
```

- Cette étape configure PHP sur la machine virtuelle.
- Elle utilise l'action `shivammathur/setup-php@v2`, qui permet d'installer une version spécifique de PHP (ici, **PHP 8.2**).
- L'option `coverage: pcov` active l'outil de couverture de code **PCOV** pour PHPUnit.

### Étape 3 : Installation des dépendances

```yaml
      - name: Install dependencies
        run: composer install --no-progress --prefer-dist
```

- Cette étape installe les dépendances du projet Symfony avec Composer.
- Les options `-no-progress` et `-prefer-dist` optimisent l'installation pour un environnement CI.

### Étape 4 à 8 : Tests CI

Dans ces étapes ont utilise les commandes de vérification et de test utilisée plus haut pour automatiser la chaîne d’intégration.

## 🛠️ Tester le workflow localement avec `act` avant d’envoyer son code

### Préparer votre workflow

 - Quitter le container et retourner à la racine du projet.
 - Créer un workflow en utilisant le modèle `.github/workflows/s5_thomas-ca_ci-cd-symfony.yml`.
 - Dans le fichier de votre nouveau workflow, modifier le répértoir *thomas-ca* avec votre propre slug.

 ```bash
 cd -
 cp .github/workflows/s5_thomas-ca_ci-cd-symfony.yml .github/workflows/s5_$USER_SLUG_ci-cd-symfony.yml
 editor .github/workflows/s5_$USER_SLUG_ci-cd-symfony.yml
 # Modifier le répértoir *thomas-ca* avec votre propre slug à dans *paths* et *working-directory*.
 ```

### Qu'est-ce que `act` ?

**Act** est un outil en ligne de commande qui permet d'exécuter **localement** des workflows GitHub Actions. Cela facilite le débogage et le test des pipelines CI/CD sans avoir à pousser des modifications sur GitHub.

### Étapes pour utiliser `act`

2. **Installer `act`** :

    - Sur votre machine hôte, installez `act` pour exécuter des GitHub Actions localement.
    - Suivez les instructions d'installation sur [Installation - act - User Guide | Manual | Docs | Documentation](https://nektosact.com/installation/).
    - Choisissez l'image `medium` comme image par défaut pour les runners `act`.
3. **Exécuter les GitHub Actions localement** :

    - Exécutez les GitHub Actions définies dans votre projet avec la commande suivante :

```bash
	act -j ci-symfony -w .github/workflows/s5_$USER_SLUG_ci-cd-symfony.yml
```

4. **Pousse ton code sur Github et constate l’exécution du workflow sur les “_runners_” de Github.**
