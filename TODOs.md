# TODOs (Suggested Student Tasks)

1) **Event‑driven UI update**
   - Parse the `Minted` event from the transaction receipt (already scaffolded).
   - Show a toast/snackbar with the token ID.

2) **Already‑Minted UX**
   - Disable the button if `hasMinted(address)` is true (already wired).
   - Add a subtle badge or hint explaining one‑per‑wallet policy.

3) **Custom Colors (Stretch)**
   - Change `mint()` to `mint(string colorHex)` and validate `#RRGGBB`.
   - Store color per token and reference it in `tokenURI()`.

4) **E2E Test**
   - Hardhat test covering: first mint succeeds, second mint reverts, tokenURI returns a data URL.

5) **Block Explorer Verification**
   - Add `npx hardhat verify --network sepolia <addr>` step in README after deployment.

6) **Accessibility**
   - Add alt text to the `<img>` and focus styles for buttons.

7) **Gas Optimization (Optional)**
   - Consider `ERC721A` or use `ERC721` with packed storage if scaling.

8) **Deployment Targets**
   - Add Holesky/Anvil config and scripts.

9) **CI**
   - Add GitHub Actions workflow to run `npm ci`, `npm test`, and type checks.

10) **Production Build**
   - `npm run build:fe` and host the `frontend/dist` on static hosting (e.g., Vercel/Netlify).
