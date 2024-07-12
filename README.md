```
docker build -t kek .
docker run kek
```

| where | 1 | 2 | 3 | 4 | avg | 60 minutes |
| ----- | ---- | ---- | ---- | ---- | ---- | ---- |
| vdsina  <img src="https://github.com/user-attachments/assets/4eae6093-83b2-4de2-98c3-9ef260149b8b" width="38" height="38">  | 855 |	825 |	915 |	900	| 873,75 |	814,5 |
| timeweb* | 780	| 750 |	750 |	705 |	746,25 |	746,25 |
| vscale** |	960 |	975 |	975 |	960 |	967,5 |	979 |
| WSL2*** | 915 |	915 |	900 |	855 |	896,25 |	891,75 |

\* Cloud-40 (2 x 3.3 ГГц CPU • 2 Гб RAM • 40 Гб NVMe)

\** Cloud 1 cpu (Intel(R) Xeon(R) Gold 6240R CPU @ 2.40GHz)

\*** WSL2: Xeon E5-2697V3, Linux WIN-15T71CA17UP 5.15.153.1-microsoft-standard-WSL2 #1 SMP Fri Mar 29 23:14:13 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
