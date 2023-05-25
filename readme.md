1. Project ini terintegrasi dengan database mongodb dan postgreSQL.
2. Terdapat dua table yaitu table user_profile di mongodb dan table user_history di postgreSQL.
3. Kolom table user_profiles: _id, username, sex, birthday, hobby, hashedPassword
4. Kolom table user_history: _id, username, scores, created_on
5. Untuk menjalankan web app ini pertama-tama buatlah database bernama fswc6 di mongodb dan postgre.
6. Kemudian pada mongodb di database fswc6 buatlah collection / table bernama user_profiles.
7. Dan pada postgreSQL di database fswc6 buatlah table bernama user_history, jalankan query berikut ini:
CREATE TABLE user_history (
	_id VARCHAR(50),
	username VARCHAR(50),
	scores INT,
	created_on TIMESTAMPTZ
)
8. Terdapat 5 halaman web yang baru ditambahkan di project ini yaitu login.ejs, sign-up.js, profile.ejs, edit-profile.ejs, rank.ejs
9. Jika ingin ke halaman login, klik login di navbar pojok kanan atas pada halaman-1 landing page (index.js)
10. Jika ingin ke halaman sign-up, klik sign-up di navbar pojok kanan atas pada halaman-1 landing page (index.js)
11. di halaman login terdapat tombol sign-up untuk mengarahkan ke halaman sign-up jika belum mempunyai akun
12. Setelah login atau berhasil membuat akun maka akan diarahkan ke halaman profile yang terdapat 4 tombol: Delete Profile, Edit Profile, Play, dan quit Game.
13. Klik edit profile untuk masuk ke halaman edit profile (edit-profile.ejs)
14. Klik play untuk bermain game gunting-kertas-batu, pencatatan score di update ke database fswc6 table user_history
15. Di halaman profile jika tombol Quit Game ditekan maka akan kembali lagi ke landing page (index.js)
16. Pada halaman landing page scroll ke bawah menuju halaman-4 (TOP SCORES) kemudian tekan tombol see more lalu 
halaman akan beralih ke halaman rank / leaderboard