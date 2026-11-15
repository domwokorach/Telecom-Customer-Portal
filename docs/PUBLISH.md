# Share the demo with a recruiter

## Quickest way: GitHub Pages

1. Create a **public** GitHub repository and upload the files from the project ZIP. Do not upload real subscriber records, credentials, private customer files, or employer-owned source code.
2. Make sure your default branch is called `main`; the included `.github/workflows/pages.yml` publishes `preview/index.html` when you push to `main`.
3. In GitHub, select **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Wait for the **Publish demo preview** workflow to complete and copy the Pages URL from the deployment.
5. Confirm the dashboard, plan switch, support request, invoice export, mobile layout and reset button in the actual deployed site before sharing it.
6. Put both links in your recruiter message: the **live demo** and **repository**. Include `docs/PORTFOLIO_CASE_STUDY.md` as an honest summary of an independent project.

GitHub Pages serves the **standalone preview**, not the full React/Java backend deployment. This intentional separation gives nontechnical reviewers a zero-install interactive demo. The React and Java implementations remain available for code review in the repository.

For a production-style cloud deployment, deploy the React build and API separately, add secrets management, TLS, OIDC, migrations and user-level authorization. Do not deploy the Basic-auth demo backend as a real public customer service.
