// helper functions
import { Link, useLoaderData } from "react-router-dom";
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helper";

// components
import Intro from "../components/Intro";
import { toast } from "react-toastify";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");

  return { userName, budgets, expenses };
}

// action
export async function dashboardAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  switch (_action) {
    case "newUser": {
      try {
        // throw new Error("HEY DUDE");
        localStorage.setItem("userName", JSON.stringify(values.userName));
        return toast.success(`welcome ${values.userName}`);
      } catch (err) {
        throw new Error("There was a problem creating your account!", err);
      }
    }
    case "createBudget": {
      try {
        createBudget({
          name: values.newBudget,
          amount: values.newBudgetAmount,
        });
        return toast.success("Budget created!");
      } catch (err) {
        throw new Error("There was a problem creating your budget!", err);
      }
    }
    case "createExpense": {
      try {
        // create an expense
        createExpense({
          name: values.newExpense,
          amount: values.newExpenseAmount,
          budgetId: values.newExpenseBudget,
        });
        return toast.success(`Expense ${values.newExpense} created!`);
      } catch (err) {
        throw new Error("There was a problem creating your expense!", err);
      }
    }
    case "deleteExpense": {
      try {
        // create an expense
        deleteItem({
          key: "expenses",
          id: values.expenseId,
        });
        return toast.success("Expense deleted!");
      } catch (err) {
        throw new Error("There was a problem deleting your expense!", err);
      }
    }
  }
}

function Dashboard() {
  const { userName, budgets, expenses } = useLoaderData();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grin-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Existing Budgets</h2>

                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link
                        to="/budget-application/expenses"
                        className="btn btn--dark"
                      >
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Personal budgeting is the secret to financial freedom.</p>
                <p>Create a budget to get started!</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
}

export default Dashboard;
