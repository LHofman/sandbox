from sandbox.main import main

def test_main(capsys):
    main()
    captured = capsys.readouterr()
    assert "Hello World!" in captured.out

