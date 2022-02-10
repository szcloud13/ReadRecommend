# API @ abcde.com/api


GET requests have parameters encoded within the URL.

POST/PUT/DELETE requests have parameters encoded within a body form.

  

book id, user id, review id are what we use to reference data.

  

What should be in a review object? Thinking it can be actual review + book aspect specific scores, e.g. plot score, character score, etc.
# Sign-In/Sign Up

|                |input|output                         |
|----------------|-------------------------------|-----------------------------|
POST auth/signup|`email=&first_name=&last_name=&password=` |**str**: token          |
|POST auth/signin        |`email=&password=  `         |   **str**: token            |
||||




# Book Data TBD

|                |input|output                         |
|----------------|-------------------------------|-----------------------------|
POST auth/signup|`email=&first_name=&last_name=&password=` |**str**: token          |
|POST auth/signin        |`email=&password=  `         |   **str**: token            |
||||


