<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# invoicing-system API

Nestjs/typescript/postgres

## Requirements

1. NodeJs
2. yarn or npm
3. git
4. docker

## Installation

1. Clone project
   ```
   $ git clone ...
   $ cd invoicing-system
   ```
2. Install dependencies
   ```
   $ yarn install
   ```
3. Rename .env.template to .env and edit the environment variables
4. Deploy database
   ```
   $ docker-compose up -d
   ```
5. run project

   ```
   $ yarn start:dev

   ```

## HTTP Request body examples

### Customers

```
{
   "name":"customer name",
   "birthdate":"1999-11-18"
}
```

### Products

```
{
   "name":"product name",
   "Price":9999,
   "stock"99
}
```

### Invoices

```
 {
  "customer": "customer uuid",
  "invoiceDetail": [
    {
      "product": "product uuid",
      "quantity": 2

    }
  ]
}
```
