# TD3 UNITEE API

## To Do

- [ ] Query select fields
- [ ] Query sort
- [ ] Push message to admin

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

> All `/me/*` routes get user ID (`req.user.id`) from `accessToken` via `authenticateUser` middleware.

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

|     | Route                      | Method   | Controller           | Used By | Note                                            |
| --- | -------------------------- | -------- | -------------------- | ------- | ----------------------------------------------- |
| [x] | `/me/expenses`             | `GET`    | `getOwnExpenses`     | Member  | Queries: dateFrom, dateTo, status               |
| [x] | `/me/expenses`             | `POST`   | `createExpense`      | Member  |                                                 |
| [x] | `/me/expenses/:id`         | `GET`    | `getOwnExpense`      | Member  |                                                 |
| [x] | `/me/expenses/:id`         | `PATCH`  | `editExpense`        | Member  | Only when it is Pending or PendingReimbursement |
| [x] | `/me/expenses/:id/confirm` | `PATCH`  | `confirmExpense`     | Member  | Only when it is PendingConfirmation             |
| [x] | `/me/expenses/:id`         | `DELETE` | `deleteExpense`      | Member  | Only when it is Pending or PendingReimbursement |
| [x] | `/me/boarding-fees`        | `GET`    | `getOwnBoardingFees` | Member  | Queries: status                                 |
| [x] | `/me/boarding-fees`        | `POST`   | `createBoardingFee`  | Member  |                                                 |
| [x] | `/me/boarding-fees/:id`    | `GET`    | `getOwnBoardingFee`  | Member  |                                                 |
| [x] | `/me/boarding-fees/:id`    | `PATCH`  | `editBoardingFee`    | Member  | Only when it is Pending                         |
| [x] | `/me/boarding-fees/:id`    | `DELETE` | `deleteBoardingFee`  | Member  | Only when it is Pending                         |
| [x] | `transactions`             | `GET`    | `getTransactions`    | Admin   | Queries: dateFrom, dateTo, status, category     |
| [x] | `transactions/:id`         | `GET`    | `getTransaction`     | Admin   |                                                 |
| [x] | `transactions/:id`         | `PATCH`  | `updateTransaction`  | Admin   | Set category and change status                  |

### Transaction Categories

|     | Route                         | Method  | Controller                  | Used By | Note          |
| --- | ----------------------------- | ------- | --------------------------- | ------- | ------------- |
| [x] | `/transaction-categories`     | `GET`   | `getTransactionCategories`  | Admin   | Queries: type |
| [x] | `/transaction-categories`     | `POST`  | `createTransactionCategory` | Admin   |               |
| [x] | `/transaction-categories/:id` | `PATCH` | `editTransactionCategory`   | Admin   |               |

### Absences

|     | Route              | Method  | Controller       | Used By | Note                      |
| --- | ------------------ | ------- | ---------------- | ------- | ------------------------- |
| [x] | `/me/absences`     | `GET`   | `getOwnAbsences` | Member  | Queries: dateFrom, dateTo |
| [x] | `/me/absences`     | `POST`  | `createAbsence`  | Member  |                           |
| [x] | `/me/absences/:id` | `PATCH` | `cancelAbsence`  | Member  |                           |
| [x] | `/absences`        | `GET`   | `getAbsences`    | Admin   | Queries: dateFrom, dateTo |

### Dishes

|     | Route         | Method   | Controller   | Used By | Note          |
| --- | ------------- | -------- | ------------ | ------- | ------------- |
| [x] | `/dishes`     | `GET`    | `getDishes`  | Admin   | Queries: type |
| [x] | `/dishes`     | `POST`   | `createDish` | Admin   |               |
| [x] | `/dishes/:id` | `PATCH`  | `updateDish` | Admin   |               |
| [x] | `/dishes/:id` | `DELETE` | `deleteDish` | Admin   |               |

### Meals

|     | Route                | Method   | Controller                  | Used By | Note |
| --- | -------------------- | -------- | --------------------------- | ------- | ---- |
| [x] | `/meals`             | `GET`    | `getMeals`                  | Admin   |      |
| [x] | `/meals`             | `POST`   | `createMeal`                | Admin   |      |
| [x] | `/meals/:id`         | `PATCH`  | `updateMeal`                | Admin   |      |
| [x] | `/meals/:id`         | `DELETE` | `deleteMeal`                | Admin   |      |
| [x] | `/meals/:day/:meal`  | `GET`    | `getMeal`                   | Member  |      |
| [x] | `/meals/ingredients` | `POST`   | `calculateIngredientsToBuy` | Member  |      |

### Notifications / Subscriptions

|     | Route                             | Method   | Controller               | Used By | Note |
| --- | --------------------------------- | -------- | ------------------------ | ------- | ---- |
| [x] | `/notifications/subscribe`        | `POST`   | `subscribe`              | Member  |      |
| [x] | `/notifications/unsubscribe`      | `POST`   | `unsubscribe`            | Member  |      |
| [x] | `/notifications`                  | `GET`    | `getNotifications`       | Both    |      |
| [x] | `/notifications/:id`              | `GET`    | `getNotification`        | Member  |      |
| [x] | `/notifications/:id/mark-as-read` | `PATCH`  | `markNotificationAsRead` | Member  |      |
| [x] | `/notifications`                  | `POST`   | `createNotification`     | Admin   |      |
| [x] | `/notifications/send`             | `POST`   | `sendNotification`       | Admin   |      |
| [x] | `/notifications/:id`              | `DELETE` | `deleteNotification`     | Admin   |      |
| [x] | `/notifications/subscriptions`    | `GET`    | `getSubscriptions`       | Admin   |      |

### Documents

|     | Route            | Method   | Controller       | Used By | Note            |
| --- | ---------------- | -------- | ---------------- | ------- | --------------- |
| [x] | `/documents`     | `GET`    | `getDocuments`   | Both    | Query: category |
| [x] | `/documents/:id` | `GET`    | `getDocument`    | Both    |                 |
| [x] | `/documents`     | `POST`   | `createDocument` | Admin   |                 |
| [x] | `/documents/:id` | `PATCH`  | `editDocument`   | Admin   |                 |
| [x] | `/documents/:id` | `DELETE` | `deleteDocument` | Admin   |                 |

### Statistics

|     | Route                            | Method | Controller                   | Used By | Note                   |
| --- | -------------------------------- | ------ | ---------------------------- | ------- | ---------------------- |
| [x] | `/statistics/balance`            | `GET`  | `calculateBalance`           | Admin   | Query: month (yyyy-MM) |
| [x] | `/statistics/income`             | `GET`  | `calculateIncome`            | Admin   | Query: month (yyyy-MM) |
| [x] | `/statistics/expense`            | `GET`  | `calculateExpense`           | Admin   | Query: month (yyyy-MM) |
| [x] | `/statistics/expense-categories` | `GET`  | `listExpenseCategories`      | Admin   | Query: month (yyyy-MM) |
| [x] | `/statistics/boarding-fee-debts` | `GET`  | `listBoardingFeeDebts`       | Admin   | Query: month (yyyy-MM) |
| [x] | `/statistics/active-members`     | `GET`  | `countActiveMembers`         | Admin   | Query: month (yyyy-MM) |
| [x] | `/statistics/new-members`        | `GET`  | `listNewMembers`             | Admin   | Query: month (yyyy-MM) |
| [x] | `/statistics/left-members`       | `GET`  | `listLeftMembers`            | Admin   | Query: month (yyyy-MM) |
| [ ] | `/statistics/absences`           | `GET`  | `listLAbsencesForEachMember` | Admin   | Query: month (yyyy-MM) |
