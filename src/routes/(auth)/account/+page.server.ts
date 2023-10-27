import { redirect } from "@sveltejs/kit";
/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  // let parentData = await parent();
  console.log(locals)
  if (locals?.user) {
    return { user:locals?.user }
  } else {
    throw redirect(
      301,
      "/login?alert_danger=you are not allowed to access that page"
    );
  }
}
