<a href="https://dorf.vercel.app">
  <img alt="Dorf - An open source visual form builder for everyone who wants to gather feedback, leads and opinions" src="https://github-production-user-asset-6210df.s3.amazonaws.com/32817933/246880518-b12cd453-4973-480a-8df0-2a7867130bc3.jpg"/> 
  <h1 align="center">Dorf</h1>
</a>

<p align="center">
  An open source visual form builder for everyone who wants to gather feedback, leads and opinions.
</p>
<p align="center">
  <a href="https://twitter.com/matheins">
    <img src="https://img.shields.io/twitter/follow/matheins?style=for-the-badge&label=%40matheins&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://github.com/matheins/dorf/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/matheins/dorf?style=for-the-badge&label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Introduction

Dorf is an open-source visual form builder to easily gather feedback, leads and opinions. Built with [Vercel KV](https://vercel.com/storage/kv), and [PlanetScale MySQL](https://planetscale.com/).

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [Typescript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Vercel KV](https://vercel.com/storage/kv) – redis
- [PlanetScale](https://planetscale.com/) – database
- [Drizzle](https://orm.drizzle.team/) - ORM
- [NextAuth.js](https://next-auth.js.org/) – auth
- [Vercel](https://vercel.com/) – hosting
- [Postmark](https://postmarkapp.com/) - emails

## Development

1. Clone this repo
2. cp .env.example .env.local
3. Set NEXTAUTH_SECRET in `.env.local` with value returned when running `openssl rand -base64 32` in your terminal
4. Configure Github auth provider by following [this guide](https://authjs.dev/getting-started/oauth-tutorial#2-configuring-oauth-provider)
5. Set DATABASE_URL in `.env.local` to the connection string of your mysql database (either locally running or a [Planetscale](https://planetscale.com/) development branch). Format should be `mysql://USER:PASSWORD@HOST/DATABASE?ssl={"rejectUnauthorized":true}`
6. Set these .env vars to `.optional()` in `src/env.mjs` if you dont want to use Email authentication:
   ```
   SMTP_FROM: z.string().min(1).optional(),
   POSTMARK_API_TOKEN: z.string().min(1).optional(),
   POSTMARK_SIGN_IN_TEMPLATE: z.string().min(1).optional(),
   POSTMARK_ACTIVATION_TEMPLATE: z.string().min(1).optional()
   ```
7. Create Vercel KV Database in [your dashboard](https://vercel.com/dashboard/stores) and connect it to a (new) project.
8. Set the provided secrets in `.env.local` for following values:

```
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

9. Run `pnpm i` to install dependencies (if you haven't installed pnpm yet follow [this guide](https://pnpm.io/installation)) 
10. Run `pnpm run db:push` to push the database schema to your database
11. Run `pnpm dev` to start the development server
12. Happy coding 🎉

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/matheins/dorf/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/matheins/dorf/pull) to add new features/make quality-of-life improvements/fix bugs.

## Author

- Matyas Heins ([@matheins](https://twitter.com/matheins))

## License

Inspired by [Plausible](https://plausible.io/) and [Dub](https://dub.sh), Dorf is open-source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. You can [find it here](https://github.com/matheins/dorf/blob/main/LICENSE).
