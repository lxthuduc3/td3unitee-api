# TD3 UNITEE API

## Functions by controllers

### Users (Profiles)

|     | Route                       | Method   | Controller               | Used By |
| --- | --------------------------- | -------- | ------------------------ | ------- |
| [x] | `/me/profile`               | `GET`    | `getOwnProfile`          | Member  |
| [x] | `/me/profile/edit`          | `PATCH`  | `updateProfile`          | Member  |
| [x] | `/members`                  | `GET`    | `getMembers`             | Both    |
| [x] | `/members/:id`              | `GET`    | `getProfile`             | Both    |
| [x] | `/members/:id`              | `PATCH`  | `updateMember`           | Admin   |
| [x] | `/members/:id/mask-as-left` | `PATCH`  | `maskMemberAsLeft`       | Admin   |
| [x] | `/requests`                 | `GET`    | `getRequests`            | Admin   |
| [x] | `/requests/:id`             | `PATCH`  | `approveRequest`         | Admin   |
| [x] | `/requests/:id`             | `DELETE` | `rejectAndDeleteRequest` | Admin   |

> All `/me/*` routes get user ID (`req.user.id`) from `accessToken` via `authenticateToken` middleware.

### Meal Registrations

|     | Route                             | Method   | Controller                   | Used By |
| --- | --------------------------------- | -------- | ---------------------------- | ------- |
| [x] | `/me/meal-registrations`          | `GET`    | `getOwnMealRegistrations`    | Member  |
| [x] | `/me/meal-registrations`          | `POST`   | `createMealRegistration`     | Member  |
| [x] | `/me/meal-registrations/:id`      | `PATCH`  | `updateMealRegistration`     | Member  |
| [x] | `/me/meal-registrations/:id`      | `DELETE` | `deleteMealRegistration`     | Member  |
| [x] | `/meal-registrations/:date/:meal` | `GET`    | `getMealRegistrationsByMeal` | Both    |

#### To Do

- [ ] Check valid time to make requests

### Transactions

|     | Route                   | Method   | Controller           | Used By | Note                                            |
| --- | ----------------------- | -------- | -------------------- | ------- | ----------------------------------------------- |
| [ ] | `/me/expenses`          | `GET`    | `getOwnExpenses`     | Member  | Queries: dateFrom, dateTo, status               |
| [ ] | `/me/expenses`          | `POST`   | `createExpense`      | Member  |                                                 |
| [ ] | `/me/expenses/:id`      | `GET`    | `getOwnExpense`      | Member  |                                                 |
| [ ] | `/me/expenses/:id`      | `PATCH`  | `editExpense`        | Member  | Only when it is Pending or PendingReimbursement |
| [ ] | `/me/expenses/:id`      | `DELETE` | `deleteExpense`      | Member  | Only when it is Pending or PendingReimbursement |
| [ ] | `/me/boarding-fees`     | `GET`    | `getOwnBoardingFees` | Member  |                                                 |
| [ ] | `/me/boarding-fees`     | `POST`   | `createBoardingFee`  | Member  |                                                 |
| [ ] | `/me/boarding-fees/:id` | `GET`    | `getOwnBoardingFee`  | Member  |                                                 |
| [ ] | `/me/boarding-fees/:id` | `PATCH`  | `editBoardingFee`    | Member  | Only when it is Pending                         |
| [ ] | `/me/boarding-fees/:id` | `DELETE` | `deleteBoardingFee`  | Member  | Only when it is Pending                         |
| [ ] | `transactions`          | `GET`    | `getTransactions`    | Admin   | Queries: dateFrom, dateTo, status, category     |
| [ ] | `transactions/:id`      | `GET`    | `getTransaction`     | Admin   |                                                 |
| [ ] | `transactions/:id`      | `PATCH`  | `updateTransaction`  | Admin   | Set category and change status                  |

### Transaction Categories

|     | Route                         | Method  | Controller                  | Used By | Note          |
| --- | ----------------------------- | ------- | --------------------------- | ------- | ------------- |
| [ ] | `/transaction-categories`     | `GET`   | `getTransactionCategories`  | Admin   | Queries: type |
| [ ] | `/transaction-categories`     | `POST`  | `createTransactionCategory` | Admin   |               |
| [ ] | `/transaction-categories/:id` | `PATCH` | `editTransactionCategory`   | Admin   |               |

### Absences

|     | Route              | Method  | Controller       | Used By | Note                      |
| --- | ------------------ | ------- | ---------------- | ------- | ------------------------- |
| [ ] | `/me/absences`     | `GET`   | `getOwnAbsences` | Member  | Queries: dateFrom, dateTo |
| [ ] | `/me/absences`     | `POST`  | `createAbsence`  | Member  |                           |
| [ ] | `/me/absences/:id` | `PATCH` | `cancelAbsence`  | Member  |                           |
| [ ] | `/absences`        | `GET`   | `getAbsences`    | Admin   | Queries: dateFrom, dateTo |

### Dishes

|     | Route         | Method   | Controller   | Used By | Note          |
| --- | ------------- | -------- | ------------ | ------- | ------------- |
| [ ] | `/dishes`     | `GET`    | `getDishes`  | Admin   | Queries: type |
| [ ] | `/dishes`     | `POST`   | `createDish` | Admin   |               |
| [ ] | `/dishes/:id` | `PATCH`  | `updateDish` | Admin   |               |
| [ ] | `/dishes/:id` | `DELETE` | `deleteDish` | Admin   |               |

### Meals

|     | Route               | Method   | Controller   | Used By | Note |
| --- | ------------------- | -------- | ------------ | ------- | ---- |
| [ ] | `/meals`            | `GET`    | `getMeals`   | Admin   |      |
| [ ] | `/meals`            | `POST`   | `createMeal` | Admin   |      |
| [ ] | `/meals/:id`        | `PATCH`  | `updateMeal` | Admin   |      |
| [ ] | `/meals/:id`        | `DELETE` | `deleteMeal` | Admin   |      |
| [ ] | `/meals/:day/:meal` | `GET`    | `getMeal`    | Member  |      |
