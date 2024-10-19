import styles from "./update.module.css";

export default function UpdatePage() {


  return (
    <form action="" method="get" className={styles['form-example']}>
      <div className={styles['form-example']}>
        <label htmlFor="user_id">user id: </label>
        <input
          type="text"
          name="user_id"
          id="user_id"
          defaultValue="asdf"
          required
        />
      </div>
      <div className={styles['form-example']}>
        <label htmlFor="bio">bio: </label>
        <textarea name="bio" id="bio" rows={4} cols={40}></textarea>
      </div>
      <div className={styles['form-example']}>
        <label htmlFor="icon">bio: </label>
        <input type="file" name="icon" id="icon" required />
      </div>
      <div className={styles['form-example']}>
        <input type="submit" value="Update Profile!!" />
      </div>
    </form>
  );
}
