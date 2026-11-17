#!/usr/bin/env python3
"""Deterministically synchronize assets/labs/*.zip and assets/senior/*.zip with labs/ sources."""
import pathlib
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent


def normalize_lf(folder: pathlib.Path) -> None:
    for path in folder.rglob('*'):
        if path.is_file() and path.suffix in {'.tf', '.hcl', '.md', '.txt', '.json'}:
            raw = path.read_bytes()
            normalized = raw.replace(b'\r\n', b'\n')
            if normalized != raw:
                path.write_bytes(normalized)


def archive_matches(src_dir: pathlib.Path, zip_path: pathlib.Path, prefix: str) -> bool:
    if not zip_path.is_file():
        return False
    expected = {
        f'{prefix}/{f.relative_to(src_dir).as_posix()}': f.read_bytes()
        for f in sorted(src_dir.rglob('*'))
        if f.is_file()
    }
    with zipfile.ZipFile(zip_path, 'r') as zf:
        if zf.testzip() is not None:
            return False
        names = [n for n in zf.namelist() if not n.endswith('/')]
        if set(names) != set(expected.keys()):
            return False
        return all(zf.read(name) == payload for name, payload in expected.items())


def rebuild_zip(src_dir: pathlib.Path, zip_path: pathlib.Path, prefix: str) -> None:
    files = sorted(f for f in src_dir.rglob('*') if f.is_file())
    with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        for file in files:
            arcname = f'{prefix}/{file.relative_to(src_dir).as_posix()}'
            info = zipfile.ZipInfo(arcname, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            zf.writestr(info, file.read_bytes())


def main() -> None:
    normalize_lf(ROOT / 'labs')
    repacked = []
    for prefix_letter in 'BIA':
        for num in range(1, 13):
            lab_id = f'{prefix_letter}{num:02d}'
            src_dir = ROOT / 'labs' / 'offline' / lab_id
            zip_path = ROOT / 'assets' / 'labs' / f'{lab_id}.zip'
            if not archive_matches(src_dir, zip_path, lab_id):
                rebuild_zip(src_dir, zip_path, lab_id)
                repacked.append(f'assets/labs/{lab_id}.zip')

    for num in range(1, 19):
        case_id = f'S{num:02d}'
        src_dir = ROOT / 'labs' / 'senior' / case_id
        zip_path = ROOT / 'assets' / 'senior' / f'{case_id}.zip'
        if not archive_matches(src_dir, zip_path, case_id):
            rebuild_zip(src_dir, zip_path, case_id)
            repacked.append(f'assets/senior/{case_id}.zip')

    print(f'REPACK COMPLETE: {len(repacked)} archives updated ({", ".join(repacked) if repacked else "none"})')


if __name__ == '__main__':
    main()
