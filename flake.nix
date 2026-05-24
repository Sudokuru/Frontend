{
  description = "Nix development environment for Frontend";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system: 
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        
      in
      {
        devShells.default = pkgs.mkShell {
          name = "Sudokuru-Frontend";
          buildInputs = with pkgs; [
            git
            jq
            pre-commit
            nodejs_24
            bun
            cargo
            rustc
          ];

          shellHook = ''
            echo "⚡ Pinned NixOS 25.11 Development Environment Activated ⚡"
            export PROJECT_ROOT=$(pwd)
            pre-commit install
            echo "Avaliable tools: $(git --version), $(jq --version), node $(node --version), npm $(npm --version), $(pre-commit --version), bun $(bun --version), $(cargo --version), $(rustc --version)"
          '';
        };
      });
}
