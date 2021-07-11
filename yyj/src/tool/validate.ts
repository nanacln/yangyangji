function validate() {
  const required = (val:string) => val.trim() !== "";
  const phone = (val:string) => /^1\d{10}$/.test(val);
  const email = (val:string) =>
    /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
      val
    );
  const code = (val:string) => /^\d{6}$/.test(val);
  return {
    required,
    phone,
    email,
    code
  };
}
export default validate;
