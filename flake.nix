{
  description = "Bun flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = nixpkgs.lib.systems.flakeExposed;
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        rec {
          deps = pkgs.stdenv.mkDerivation {
            name = "bun-deps";
            src = ./.;

            installPhase = ''
              mkdir -p $out
              cp package.json bun.lock $out/
              cd $out
              export HOME=$(mktemp -d)
              ${pkgs.bun}/bin/bun install --frozen-lockfile
              rm -rf $HOME/.bun
            '';

            outputHash = "sha256-6xpY1ZrsQV7P7Usn6u/orJ031drLwZyyOI713lAdgwE=";
            outputHashAlgo = "sha256";
            outputHashMode = "recursive";
          };

          default = pkgs.stdenv.mkDerivation {
            pname = "bun-app";
            version = "0.1.0";
            src = ./.;

            nativeBuildInputs = [ pkgs.bun ];

            configurePhase = ''
              ln -s ${deps}/node_modules ./node_modules
            '';

            buildPhase = ''
              runHook preBuild
              export HOME=$(mktemp -d)
              ls -R
              bun run build
              runHook postBuild
            '';

            installPhase = ''
              runHook preInstall
              mkdir -p $out
              cp -r dist/* $out/
              runHook postInstall
            '';
          };
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [ bun ];
          };
        }
      );
    };
}
